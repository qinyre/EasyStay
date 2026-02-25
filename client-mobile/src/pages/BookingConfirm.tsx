import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, Calendar, Shield, CheckCircle } from 'lucide-react';
import { NavBar, Card, Button, Form, Input, TextArea, Toast, Dialog, Checkbox } from 'antd-mobile';
import { getHotelById, createBooking, saveBooking } from '../services/api';
import { Hotel, Room } from '../types';
import { useSearch } from '../contexts/SearchContext';
import { format, differenceInDays } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface BookingConfirmState {
  roomId: string;
  guestName: string;
  guestPhone: string;
  specialRequests: string;
  agreeTerms: boolean;
}

const BookingConfirm: React.FC = () => {
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { dateRange } = useSearch();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [guestCount, setGuestCount] = useState(1);

  const [form, setForm] = useState<BookingConfirmState>({
    roomId: roomId || '',
    guestName: '',
    guestPhone: '',
    specialRequests: '',
    agreeTerms: false,
  });

  useEffect(() => {
    const loadData = async () => {
      if (hotelId) {
        try {
          const data = await getHotelById(hotelId);
          setHotel(data || null);
          if (data && roomId) {
            const selectedRoom = data.rooms.find(r => r.id === roomId);
            setRoom(selectedRoom || data.rooms[0] || null);
          }
        } catch (error) {
          console.error('Failed to load hotel:', error);
          Toast.show('加载失败');
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [hotelId, roomId]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  if (!hotel || !room) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-500">酒店或房型信息不存在</div>
      </div>
    );
  }

  const nights = differenceInDays(dateRange.end, dateRange.start);
  const roomPrice = room.price * nights;
  const tax = Math.round(roomPrice * 0.1);
  const total = roomPrice + tax;

  const handleSubmit = async () => {
    if (!form.guestName.trim()) {
      Toast.show('请输入入住人姓名');
      return;
    }
    if (!form.guestPhone.trim()) {
      Toast.show('请输入联系电话');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(form.guestPhone)) {
      Toast.show('请输入正确的手机号码');
      return;
    }
    if (!form.agreeTerms) {
      Toast.show('请同意预订条款');
      return;
    }

    const result = await Dialog.confirm({
      content: `确认支付 ¥${total}？`,
    });

    if (result) {
      setSubmitting(true);
      try {
        const booking = await createBooking({
          hotelId: hotel.id,
          roomId: room.id,
          checkIn: dateRange.start.toISOString(),
          checkOut: dateRange.end.toISOString(),
          totalPrice: total,
          guestName: form.guestName,
          guestPhone: form.guestPhone,
        });

        Toast.show({ icon: 'success', content: '预订成功！' });
        setTimeout(() => {
          navigate(`/booking/${booking.id}`, { replace: true });
        }, 500);
      } catch {
        Toast.show('预订失败，请重试');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleSaveBooking = async () => {
    if (!form.guestName.trim()) {
      Toast.show('请输入入住人姓名');
      return;
    }
    if (!form.guestPhone.trim()) {
      Toast.show('请输入联系电话');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(form.guestPhone)) {
      Toast.show('请输入正确的手机号码');
      return;
    }

    setSubmitting(true);
    try {
      await saveBooking({
        hotelId: hotel.id,
        roomId: room.id,
        checkIn: dateRange.start.toISOString(),
        checkOut: dateRange.end.toISOString(),
        totalPrice: total,
        guestName: form.guestName,
        guestPhone: form.guestPhone,
      });

      Toast.show({ icon: 'success', content: t('booking.messages.save_success') });
      setTimeout(() => {
        navigate('/bookings', { replace: true });
      }, 500);
    } catch {
      Toast.show(t('booking.messages.save_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <NavBar
        onBack={() => navigate(-1)}
        backArrow={<ChevronLeft size={24} />}
        className="bg-white sticky top-0 z-20"
      >
        {t('booking.confirm_title')}
      </NavBar>

      <div className="p-4 space-y-4">
        <Card
          className="rounded-xl overflow-hidden active:opacity-90 transition-opacity"
          onClick={() => navigate(`/hotel/${hotel.id}`)}
        >
          <div className="flex gap-3">
            <img
              src={room.image || hotel.image}
              alt={hotel.name_cn}
              className="w-24 h-24 object-cover rounded-lg bg-gray-200"
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{hotel.name_cn}</h3>
              <p className="text-sm text-gray-500 mt-1">{hotel.star_level}星级 · {hotel.location.city || hotel.location.address}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">{room.type}</span>
                <span className="text-xs text-gray-400">最多入住{room.stock}人</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <div className="text-xs text-gray-400">{t('home.check_in')}</div>
                  <div className="font-bold text-gray-900">{format(dateRange.start, 'MM月dd日')}</div>
                  <div className="text-xs text-gray-400">{['周日', '周一', '周二', '周三', '周四', '周五', '周六'][dateRange.start.getDay()]}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">{nights}晚</div>
                  <div className="text-gray-300">→</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">{t('home.check_out')}</div>
                  <div className="font-bold text-gray-900">{format(dateRange.end, 'MM月dd日')}</div>
                  <div className="text-xs text-gray-400">{['周日', '周一', '周二', '周三', '周四', '周五', '周六'][dateRange.end.getDay()]}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-700">
              <Users size={18} className="text-gray-400" />
              <span className="text-sm">入住人数</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="mini"
                disabled={guestCount <= 1}
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
              >
                -
              </Button>
              <span className="font-bold text-lg w-8 text-center">{guestCount}</span>
              <Button
                size="mini"
                disabled={guestCount >= room.stock}
                onClick={() => setGuestCount(Math.min(room.stock, guestCount + 1))}
              >
                +
              </Button>
            </div>
          </div>
        </Card>

        <Card title="入住信息" className="rounded-xl">
          <Form layout="vertical">
            <Form.Item label="入住人姓名">
              <Input
                placeholder="请输入真实姓名"
                value={form.guestName}
                onChange={val => setForm({ ...form, guestName: val })}
                clearable
              />
            </Form.Item>
            <Form.Item label="联系电话">
              <Input
                placeholder="用于接收预订短信"
                value={form.guestPhone}
                onChange={val => setForm({ ...form, guestPhone: val })}
                clearable
                type="tel"
                maxLength={11}
              />
            </Form.Item>
            <Form.Item label="特殊要求（可选）">
              <TextArea
                placeholder="如：高楼层、无烟房等"
                value={form.specialRequests}
                onChange={val => setForm({ ...form, specialRequests: val })}
                rows={2}
              />
            </Form.Item>
          </Form>
        </Card>

        <Card title="费用明细" className="rounded-xl">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">房费 (¥{room.price} × {nights}晚)</span>
              <span className="text-gray-900">¥{roomPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">税费与服务费</span>
              <span className="text-gray-900">¥{tax}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-100">
              <span className="font-bold text-gray-900">{t('booking.total_price')}</span>
              <span className="font-bold text-xl text-blue-600">¥{total}</span>
            </div>
          </div>
        </Card>

        <div className="flex items-start gap-2 px-2">
          <Checkbox
            checked={form.agreeTerms}
            onChange={val => setForm({ ...form, agreeTerms: val })}
          />
          <span className="text-xs text-gray-500 flex-1">
            我已阅读并同意
            <span className="text-blue-600 underline" onClick={() => navigate('/terms')}>《预订条款》</span>
            和
            <span className="text-blue-600 underline" onClick={() => navigate('/privacy')}>《隐私政策》</span>
            ，预订成功后不可取消
          </span>
        </div>

        <div className="flex items-center justify-center gap-6 py-4 text-gray-400">
          <div className="flex items-center gap-1 text-xs">
            <Shield size={14} />
            <span>担保交易</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <CheckCircle size={14} />
            <span>即时确认</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 safe-area-bottom">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="text-xs text-gray-400">{t('booking.total_price')}</div>
            <div className="text-xl font-bold text-blue-600">¥{total}</div>
          </div>
          <Button
            size="large"
            className="flex-1"
            disabled={!form.agreeTerms}
            loading={submitting}
            onClick={handleSaveBooking}
          >
            {submitting ? t('booking.actions.saving') : t('booking.actions.save')}
          </Button>
          <Button
            color="primary"
            size="large"
            className="flex-1"
            disabled={!form.agreeTerms}
            loading={submitting}
            onClick={handleSubmit}
          >
            {t('booking.confirm_title')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirm;
