import React, { useState, useEffect } from "react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function ThemedCalendar({ initialDate = new Date(2026, 6, 14), onSelectDate, fullWidth = false }) {
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth()); // 0-indexed (6 = July)
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear()); // 2026
  const [selectedDate, setSelectedDate] = useState(initialDate);

  useEffect(() => {
    setCurrentMonth(initialDate.getMonth());
    setCurrentYear(initialDate.getFullYear());
    setSelectedDate(initialDate);
  }, [initialDate]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    if (onSelectDate) {
      onSelectDate(newDate);
    }
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Generate blank spaces for days of previous month
  const blanks = Array(firstDay).fill(null);
  
  // Generate days of current month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const totalSlots = [...blanks, ...days];

  return (
    <div className={fullWidth ? "w-full select-none" : "bg-white rounded-2xl border border-[#eef2f1] shadow-lg p-5 w-80 select-none"}>
      {/* Calendar Header */}
      {!fullWidth && (
        <div className="flex justify-between items-center pb-4 border-b border-[#f1f4f3] mb-4">
          <button
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-lg border border-[#e0e6e4] bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <span className="text-base font-bold text-[#16221f]">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-lg border border-[#e0e6e4] bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      )}

      {/* Week Days Headers */}
      <div className="grid grid-cols-7 gap-y-2 mb-2 text-center">
        {DAYS_OF_WEEK.map((d) => (
          <span key={d} className="text-xxs font-bold text-gray-400 tracking-wider">
            {d}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-1.5 text-center">
        {totalSlots.map((slot, index) => {
          if (slot === null) {
            return <div key={`blank-${index}`} className={fullWidth ? "w-full aspect-square" : "w-10 h-10"} />;
          }

          const isSelected = 
            selectedDate &&
            selectedDate.getDate() === slot &&
            selectedDate.getMonth() === currentMonth &&
            selectedDate.getFullYear() === currentYear;

          return (
            <div key={`day-${slot}`} className={fullWidth ? "w-full aspect-square p-0.5" : "w-10 h-10 p-0.5"}>
              <button
                onClick={() => handleDayClick(slot)}
                type="button"
                className={`w-full h-full flex items-center justify-center text-sm font-semibold rounded-xl transition-colors border-none cursor-pointer ${
                  isSelected
                    ? "bg-[#0f9e8e] text-white"
                    : "bg-transparent text-[#2c3835] hover:bg-gray-100"
                }`}
              >
                {slot}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
