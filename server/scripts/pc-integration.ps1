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
if ($ping.code -ne 200) { throw 'ping failed' }
Ok 'ping'

$ts = [int][double]::Parse((Get-Date -UFormat %s))

$mPhone = '138' + ($ts.ToString().PadLeft(9, '0')).Substring(0, 9)
$mEmail = "m$ts@example.com"
$reg = Req POST "$base/auth/register" @{ phone = $mPhone; email = $mEmail; password = '123456'; confirmPassword = '123456'; name = '商户'; role = 'merchant' }
$mTok = $reg.data.token
$mHdr = @{ Authorization = "Bearer $mTok" }
Ok 'auth register(merchant)'

$imgPath = 'd:\Code All\Python Program\EasyStay\client-pc\src\images\background.png'
$upJson = curl.exe -sS -X POST -H "Authorization: Bearer $mTok" -F "file=@$imgPath;type=image/png" "$base/merchant/upload"
$up = $upJson | ConvertFrom-Json
if ($up.code -ne 200 -or -not $up.data.url) { throw "upload failed: $upJson" }
Ok 'merchant upload'

$hotelBody = @{
  name_cn    = 'PC对接测试酒店'
  name_en    = 'PC Integration Hotel'
  address    = '上海市浦东新区测试路100号'
  star_level = 5
  open_date  = '2026-01-01'
  banner_url = $up.data.url
  tags       = @('豪华')
  rooms      = @(@{ type_name = '豪华大床房'; price = 888; stock = 5 })
}

$h = Req POST "$base/merchant/hotels" $hotelBody $mHdr
$hid = $h.data.id
Ok 'merchant create hotel (pc payload)'

$detail = Req GET "$base/merchant/hotels/$hid" $null $mHdr
if (-not $detail.data.rooms[0].name) { throw 'room.name missing after transform' }
Ok 'merchant get hotel by id'

$aPhone = '137' + (($ts + 1).ToString().PadLeft(9, '0')).Substring(0, 9)
$aEmail = "a$ts@example.com"
$areg = Req POST "$base/auth/register" @{ phone = $aPhone; email = $aEmail; password = '123456'; confirmPassword = '123456'; name = '管理员'; role = 'admin' }
$aTok = $areg.data.token
$aHdr = @{ Authorization = "Bearer $aTok" }
Ok 'auth register(admin)'

$adminDetail = Req GET "$base/admin/hotels/$hid" $null $aHdr
if ($adminDetail.code -ne 200) { throw 'admin get hotel failed' }
Ok 'admin get hotel by id'

Req DELETE "$base/merchant/hotels/$hid" $null $mHdr | Out-Null
Ok 'merchant delete hotel'

Write-Output 'PC_INTEGRATION_OK'
