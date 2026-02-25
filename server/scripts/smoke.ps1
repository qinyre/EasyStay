$ErrorActionPreference = 'Stop'

$base = 'http://localhost:3000/api/v1'

function J($o) { $o | ConvertTo-Json -Depth 12 -Compress }

function Req([string]$method, [string]$url, $body = $null, $headers = $null) {
  if ($null -ne $body) {
    return Invoke-RestMethod -Method $method -Uri $url -Headers $headers -ContentType 'application/json' -Body (J $body)
  }
  return Invoke-RestMethod -Method $method -Uri $url -Headers $headers
}

function Ok([string]$name) { Write-Output "[OK] $name" }

$ping = Req GET "$base/ping"
if ($ping.code -ne 200) { throw 'ping not 200' }
Ok 'ping'

$ts = [int][double]::Parse((Get-Date -UFormat %s))

$uPhone = '139' + ($ts.ToString().PadLeft(9, '0')).Substring(0, 9)
$uEmail = "u$ts@example.com"
$uPass = '123456'

$reg = Req POST "$base/auth/register" @{ phone = $uPhone; email = $uEmail; password = $uPass; confirmPassword = $uPass; name = '用户A'; role = 'user' }
$uToken = $reg.data.token
$uHdr = @{ Authorization = "Bearer $uToken" }
Ok 'auth register(user)'

$me = Req GET "$base/auth/me" $null $uHdr
if ($me.data.phone -ne $uPhone) { throw 'me mismatch' }
Ok 'auth me'

$send = Req POST "$base/auth/send-reset-code" @{ email = $uEmail }
$code = $send.data.code
Ok 'auth send-reset-code'

Req POST "$base/auth/verify-reset-code" @{ email = $uEmail; code = $code } | Out-Null
Ok 'auth verify-reset-code'

Req POST "$base/auth/reset-password-with-code" @{ email = $uEmail; code = $code; newPassword = '654321' } | Out-Null
Ok 'auth reset-password-with-code'

$login = Req POST "$base/auth/login" @{ phone = $uPhone; password = '654321' }
$uToken2 = $login.data.token
$uHdr2 = @{ Authorization = "Bearer $uToken2" }
Ok 'auth login'

Req POST "$base/auth/logout" $null $uHdr2 | Out-Null
Ok 'auth logout'

$ts2 = $ts + 1
$mPhone = '138' + ($ts2.ToString().PadLeft(9, '0')).Substring(0, 9)
$mEmail = "m$ts2@example.com"

$mReg = Req POST "$base/auth/register" @{ phone = $mPhone; email = $mEmail; password = $uPass; confirmPassword = $uPass; name = '商户A'; role = 'merchant' }
$mToken = $mReg.data.token
$mHdr = @{ Authorization = "Bearer $mToken" }
Ok 'auth register(merchant)'

$imgPath = 'd:\Code All\Python Program\EasyStay\client-pc\src\images\background.png'
$upJson = curl.exe -sS -X POST -H "Authorization: Bearer $mToken" -F "file=@$imgPath;type=image/png" "$base/merchant/upload"
$up = $upJson | ConvertFrom-Json
if ($up.code -ne 200 -or -not $up.data.url) { throw "upload failed: $upJson" }
Ok 'merchant upload'

$hotelBody = @{
  name_cn   = '测试酒店'
  name_en   = 'Test Hotel'
  address   = '上海市浦东新区测试路1号'
  star_level = 5
  banner_url = $up.data.url
  tags      = @('豪华')
  rooms     = @(@{ name = '豪华大床房'; price = 999; capacity = 2; description = '测试'; image_url = $up.data.url; amenities = @('WiFi') })
}

$h = Req POST "$base/merchant/hotels" $hotelBody $mHdr
$hid = $h.data.id
Ok 'merchant create hotel'

$my = Req GET "$base/merchant/hotels" $null $mHdr
if (-not ($my.data | Where-Object { $_.id -eq $hid })) { throw 'hotel not in my list' }
Ok 'merchant get my hotels'

$hotelBody2 = $hotelBody.Clone()
$hotelBody2.name_cn = '测试酒店-改'
Req PUT "$base/merchant/hotels/$hid" $hotelBody2 $mHdr | Out-Null
Ok 'merchant update hotel'

$ts3 = $ts + 2
$aPhone = '137' + ($ts3.ToString().PadLeft(9, '0')).Substring(0, 9)
$aEmail = "a$ts3@example.com"

$aReg = Req POST "$base/auth/register" @{ phone = $aPhone; email = $aEmail; password = $uPass; confirmPassword = $uPass; name = '管理员A'; role = 'admin' }
$aToken = $aReg.data.token
$aHdr = @{ Authorization = "Bearer $aToken" }
Ok 'auth register(admin)'

Req GET "$base/admin/hotels" $null $aHdr | Out-Null
Ok 'admin get hotels'

Req PATCH "$base/admin/audit/$hid" @{ action = 'approve' } $aHdr | Out-Null
Ok 'admin audit approve'

Req PATCH "$base/admin/publish/$hid" @{ action = 'publish' } $aHdr | Out-Null
Ok 'admin publish'

Req GET "$base/mobile/home/banners" | Out-Null
Ok 'mobile banners'

Req GET "$base/mobile/home/popular-cities" | Out-Null
Ok 'mobile popular cities'

$list = Req GET "$base/mobile/hotels?keyword=%E6%B5%8B%E8%AF%95%E9%85%92%E5%BA%97&page=1&pageSize=10"
if ($list.data.total -lt 1) { throw 'hotel not visible in mobile list' }
Ok 'mobile hotels list'

$detail = Req GET "$base/mobile/hotels/$hid"
$rid = $detail.data.rooms[0].id
Ok 'mobile hotel detail'

$bk = Req POST "$base/mobile/bookings" @{ hotelId = $hid; roomId = $rid; checkIn = '2026-03-01'; checkOut = '2026-03-02'; totalPrice = 999; guestName = '张三'; guestPhone = $uPhone } $uHdr2
$bid = $bk.data.id
Ok 'mobile create booking'

Req GET "$base/mobile/bookings?page=1&pageSize=10" $null $uHdr2 | Out-Null
Ok 'mobile bookings list'

Req GET "$base/mobile/bookings/$bid" $null $uHdr2 | Out-Null
Ok 'mobile booking detail'

Req PATCH "$base/mobile/bookings/$bid" @{ status = 'confirmed' } $uHdr2 | Out-Null
Ok 'mobile booking update'

Req PATCH "$base/mobile/bookings/$bid/cancel" @{} $uHdr2 | Out-Null
Ok 'mobile booking cancel'

$pcU = "user$ts"
$pcP = '123456'

Req POST "$base/user/register" @{ username = $pcU; password = $pcP } | Out-Null
Ok 'pc user register'

$pcLogin = Req POST "$base/user/login" @{ username = $pcU; password = $pcP }
$pcToken = $pcLogin.data.token
$pcHdr = @{ Authorization = "Bearer $pcToken" }
Ok 'pc user login'

Req GET "$base/user/profile" $null $pcHdr | Out-Null
Ok 'pc user profile'

Req PUT "$base/user/profile" @{ password = '654321' } $pcHdr | Out-Null
Ok 'pc user update profile'

$pcLogin2 = Req POST "$base/user/login" @{ username = $pcU; password = '654321' }
$pcToken2 = $pcLogin2.data.token
$pcHdr2 = @{ Authorization = "Bearer $pcToken2" }
Ok 'pc user relogin'

$ord = Req POST "$base/order" @{ hotel_id = $hid; room_id = $rid; check_in_date = '2026-03-01'; check_out_date = '2026-03-02'; guests = 1 } $pcHdr2
$oid = $ord.data.order_id
Ok 'pc create order'

Req GET "$base/order" $null $pcHdr2 | Out-Null
Ok 'pc get orders'

Req GET "$base/order/$oid" $null $pcHdr2 | Out-Null
Ok 'pc order detail'

Req PATCH "$base/order/$oid/status" @{ status = 'confirmed' } $pcHdr2 | Out-Null
Ok 'pc order update status'

Req PATCH "$base/order/$oid/payment" @{ payment_status = 'paid'; payment_method = 'mock'; transaction_id = 't1' } $pcHdr2 | Out-Null
Ok 'pc order payment'

Req GET "$base/order/admin/all" $null $aHdr | Out-Null
Ok 'admin get all orders'

Write-Output 'ALL_SMOKE_TESTS_PASSED'
