import { useEffect, useMemo, useState } from 'react';

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { ko } from 'date-fns/locale';

// 아이콘
import calendarCloseIcon from '../../assets/icons/calander/close.svg';
import calendarPreviousIcon from '../../assets/icons/calander/previous.svg';
import calendarNextIcon from '../../assets/icons/calander/next.svg';

export interface CalendarModalProps {
  open: boolean;
  selectedDate?: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function CalendarModal({ open, selectedDate, onSelect, onClose }: CalendarModalProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(selectedDate ?? new Date()));

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const calendarCells = useMemo(() => {
    const monthStart = startOfMonth(visibleMonth);
    const days = eachDayOfInterval({ start: monthStart, end: endOfMonth(visibleMonth) });
    return [...Array<Date | null>(getDay(monthStart)).fill(null), ...days];
  }, [visibleMonth]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-title"
        className="relative inline-flex w-full max-w-[361px] flex-col items-center rounded-lg bg-card px-6 pb-4 pt-2 shadow-[2px_16px_19px_0_rgba(0,0,0,0.09)]"
      >
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-2 top-2 flex size-7 items-center justify-center focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-main-500"
        >
          <img src={calendarCloseIcon} alt="" className="shrink-0" />
        </button>

        <div className="mb-7 mt-10 flex w-full items-center justify-between px-1">
          <button
            type="button"
            aria-label="이전 달"
            onClick={() => setVisibleMonth((month) => subMonths(month, 1))}
            className="flex size-8 items-center justify-center focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-main-500"
          >
            <img src={calendarPreviousIcon} alt="" className="shrink-0" />
          </button>
          <h2
            id="calendar-title"
            className="text-center text-[14px] font-semibold leading-[14px] text-gray-200 [font-feature-settings:'liga'_off,'clig'_off]"
          >
            {format(visibleMonth, 'yyyy년 M월', { locale: ko })}
          </h2>
          <button
            type="button"
            aria-label="다음 달"
            onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
            className="flex size-8 items-center justify-center focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-main-500"
          >
            <img src={calendarNextIcon} alt="" className="shrink-0" />
          </button>
        </div>

        <div className="grid w-full grid-cols-7 text-center">
          {WEEKDAYS.map((weekday) => (
            <span
              key={weekday}
              className="pb-7 text-center text-[10px] font-semibold uppercase leading-3 tracking-[1.5px] text-gray-100 [font-feature-settings:'liga'_off,'clig'_off]"
            >
              {weekday}
            </span>
          ))}

          {calendarCells.map((date, index) =>
            date ? (
              <button
                key={date.toISOString()}
                type="button"
                aria-label={format(date, 'yyyy년 M월 d일', { locale: ko })}
                aria-pressed={selectedDate ? isSameDay(date, selectedDate) : false}
                onClick={() => onSelect(date)}
                className={`mx-auto mb-3 flex size-10 items-center justify-center rounded-full text-title-2 leading-normal transition-colors focus-visible:outline-2 focus-visible:outline-main-500 ${
                  selectedDate && isSameDay(date, selectedDate)
                    ? 'bg-main-500 text-white'
                    : 'text-gray-200 hover:bg-main-50'
                }`}
              >
                {format(date, 'd')}
              </button>
            ) : (
              <span key={`empty-${index}`} aria-hidden="true" className="mb-3 size-10" />
            ),
          )}
        </div>
      </section>
    </div>
  );
}

export default CalendarModal;
