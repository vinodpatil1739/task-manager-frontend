import React from 'react';
import { getYear, getMonth, getWeeksInMonth, startOfMonth, addWeeks, setYear, setMonth, format } from 'date-fns';

function FilterBar({ filter, setFilter }) {
  const currentYear = getYear(new Date());
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const weeksOfMonth = getWeeksInMonth(filter.date);
  const weeks = Array.from({ length: weeksOfMonth }, (_, i) => i + 1);

  const handleYearChange = (e) => {
    const newDate = setYear(filter.date, parseInt(e.target.value));
    setFilter({ ...filter, date: newDate });
  };
  
  const handleMonthChange = (e) => {
    const newDate = setMonth(filter.date, parseInt(e.target.value));
    setFilter({ ...filter, date: newDate });
  };

  const handleWeekChange = (e) => {
    const weekIndex = parseInt(e.target.value) - 1;
    const firstDayOfMonth = startOfMonth(filter.date);
    const newDate = addWeeks(firstDayOfMonth, weekIndex);
    setFilter({ ...filter, date: newDate });
  };

  const handleDateChange = (e) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split('-').map(Number);
      const newDate = new Date(year, month - 1, day);
      setFilter({ ...filter, date: newDate });
    }
  };

  const handleModeChange = (e) => {
    setFilter({ ...filter, mode: e.target.value });
  };
  
  const displayDate = filter.date 
    ? new Date(filter.date.getTime() - (filter.date.getTimezoneOffset() * 60000)).toISOString().split('T')[0]
    : '';

  return (
    <div className="filter-bar">
      <select value={filter.mode} onChange={handleModeChange}>
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
      </select>
      
      {filter.mode !== 'day' && (
        <select value={getYear(filter.date)} onChange={handleYearChange}>
          {years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>
      )}

      {filter.mode !== 'day' && (
         <select value={getMonth(filter.date)} onChange={handleMonthChange}>
          {months.map(monthIndex => (
            <option key={monthIndex} value={monthIndex}>
              {format(new Date(currentYear, monthIndex), 'MMMM')}
            </option>
          ))}
        </select>
      )}

      {filter.mode === 'week' && (
        <select onChange={handleWeekChange} value={format(filter.date, 'w')}>
          <option value="">Select a week</option>
          {weeks.map(weekNum => <option key={weekNum} value={weekNum}>Week {weekNum}</option>)}
        </select>
      )}

      {filter.mode === 'day' && (
        <input 
          type="date"
          value={displayDate}
          onChange={handleDateChange}
        />
      )}
    </div>
  );
}

export default FilterBar;