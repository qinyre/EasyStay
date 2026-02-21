import React, { useState, useEffect, useRef } from 'react';
import { Popup, Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { format, isBefore, isSameDay, startOfDay, addMonths, differenceInDays } from 'date-fns';

interface CalendarPickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (start: Date, end: Date) => void;
  defaultDateRange?: [Date, Date];
  monthsToDisplay?: number; // How many months to show
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  visible,
  onClose,
  onConfirm,
  defaultDateRange,
  monthsToDisplay = 12
}) => {
  const { t } = useTranslation();
  const [checkIn, setCheckIn] = useState<Date | null>(defaultDateRange?.[0] || null);
  const [checkOut, setCheckOut] = useState<Date | null>(defaultDateRange?.[1] || null);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = startOfDay(new Date());

  // Reset state when opening if needed, or keep previous selection
  useEffect(() => {
    if (visible && defaultDateRange) {
        setCheckIn(defaultDateRange[0]);
        setCheckOut(defaultDateRange[1]);
        // Ideally scroll to check-in month
    }
  }, [visible]);

  // Auto-confirm when both dates are set
  useEffect(() => {
    if (checkIn && checkOut) {
        // Do not auto close based on user request, user will click 'Confirm' or 'X'
    }
  }, [checkIn, checkOut]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (date: Date) => {
    // Disable past dates
    if (isBefore(date, today)) return;

    // Logic 1: No check-in selected -> Select check-in
    if (!checkIn) {
      setCheckIn(date);
      setCheckOut(null);
    }
    // Logic 2: Check-in selected, no check-out -> Select check-out
    else if (!checkOut) {
      if (isBefore(date, checkIn) || isSameDay(date, checkIn)) {
        // If clicking date before check-in, reset and select new check-in
        setCheckIn(date);
        setCheckOut(null);
      } else {
        // Limit max 180 days
        if (differenceInDays(date, checkIn) > 180) {
            Toast.show('最多选择180晚');
            return;
        }
        setCheckOut(date);
        // Do not auto confirm/close, wait for user action
      }
    }
    // Logic 3: Both selected -> Reset and select new check-in
    else {
      setCheckIn(date);
      setCheckOut(null);
    }
  };

  const renderMonth = (monthOffset: number) => {
    const targetDate = addMonths(today, monthOffset);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    
    const totalDays = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty cells for previous month padding
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${monthOffset}-${i}`} className="w-[14.28%] h-14" />);
    }

    // Days of current month
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      const isToday = isSameDay(date, today);
      const isPast = isBefore(date, today);
      
      let className = "w-[14.28%] h-14 flex flex-col items-center justify-center text-sm cursor-pointer relative mx-[1px] my-[2px] rounded-sm ";
      let content: React.ReactNode = <span className="text-base font-medium">{i}</span>;
      let subContent: React.ReactNode = null;

      // Styles
      if (isPast) {
        className += "text-gray-300 cursor-not-allowed bg-transparent";
      } else {
        if (checkIn && isSameDay(date, checkIn)) {
            className += " bg-blue-500 text-white shadow-md z-10 rounded-l-md"; // Check-in style
            subContent = <span className="text-[10px] scale-90 mt-0.5">入住</span>;
        } else if (checkOut && isSameDay(date, checkOut)) {
            className += " bg-red-500 text-white shadow-md z-10 rounded-r-md"; // Check-out style
            subContent = <span className="text-[10px] scale-90 mt-0.5">离店</span>;
        } else if (checkIn && checkOut && isBefore(checkIn, date) && isBefore(date, checkOut)) {
            className += " bg-blue-50 text-blue-600 rounded-none"; // In-range style
        } else if (isToday) {
            className += " text-blue-600 font-bold";
            content = <span className="text-base font-bold">今</span>;
        } else {
            className += " text-gray-800";
        }
      }

      days.push(
        <div 
            key={`${monthOffset}-${i}`} 
            className={className}
            onClick={() => handleDateClick(date)}
        >
            {content}
            {subContent}
        </div>
      );
    }

    return (
        <div key={monthOffset} className="mb-6">
            <div className="text-center font-bold text-lg py-4 text-gray-800 sticky top-0 bg-white/95 backdrop-blur-sm z-20 border-b border-gray-50">
                {year}年{month + 1}月
            </div>
            <div className="flex flex-wrap px-2">
                {days}
            </div>
        </div>
    );
  };

  const getDaysCount = () => {
      if (!checkIn || !checkOut) return 0;
      return differenceInDays(checkOut, checkIn);
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', height: '85vh', display: 'flex', flexDirection: 'column' }}
    >
      <div className="flex flex-col h-full bg-white rounded-t-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100 shrink-0">
            <div className="text-xl font-bold text-gray-900">选择日期</div>
            <div 
                className="p-2 -mr-2 rounded-full text-gray-500 active:bg-gray-100"
                onClick={onClose}
            >
                <X size={24} />
            </div>
        </div>

        {/* Week Days Header - Sticky */}
        <div className="flex bg-gray-50 py-3 shrink-0 text-gray-500 text-sm font-medium border-b border-gray-100">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                <div key={day} className="flex-1 text-center">
                    {day}
                </div>
            ))}
        </div>

        {/* Scrollable Months Area */}
        <div ref={containerRef} className="flex-1 overflow-y-auto bg-white pb-20">
            {Array.from({ length: monthsToDisplay }).map((_, index) => renderMonth(index))}
        </div>

        {/* Footer Action Bar */}
        <div className="p-4 border-t border-gray-100 bg-white safe-area-bottom shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    {!checkIn ? (
                        <span className="text-gray-500 text-sm">请选择入住日期</span>
                    ) : !checkOut ? (
                        <>
                            <span className="text-gray-900 font-bold text-sm">已选入住</span>
                            <span className="text-blue-600 text-base font-bold ml-2">{format(checkIn, 'MM月dd日')}</span>
                        </>
                    ) : (
                        <div className="flex items-baseline">
                            <span className="text-gray-500 text-xs mr-1">共</span>
                            <span className="text-blue-600 text-lg font-bold">{getDaysCount()}</span>
                            <span className="text-gray-500 text-xs ml-1">晚</span>
                            <span className="text-gray-400 text-xs mx-2">|</span>
                            <span className="text-gray-900 text-sm font-medium">
                                {format(checkIn, 'MM-dd')} - {format(checkOut, 'MM-dd')}
                            </span>
                        </div>
                    )}
                </div>
                
                <button
                    className={`px-8 py-2.5 rounded-full font-bold text-white transition-all ${
                        checkIn && checkOut 
                        ? 'bg-blue-600 shadow-lg shadow-blue-200 active:scale-95' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                    onClick={() => {
                        if (checkIn && checkOut) {
                            onConfirm(checkIn, checkOut);
                            onClose();
                        }
                    }}
                    disabled={!checkIn || !checkOut}
                >
                    确认选择
                </button>
            </div>
        </div>
      </div>
    </Popup>
  );
};
