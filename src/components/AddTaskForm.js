import React, { useState, useEffect } from 'react';
import { format, getYear, getMonth, getWeeksInMonth, startOfMonth, addWeeks, setYear, setMonth, startOfWeek } from 'date-fns';

function AddTaskForm({ onTaskAdd }) {
  const [title, setTitle] = useState('');
  const [taskType, setTaskType] = useState('Daily');
  
  // A full Date object to manage selections
  const [selectedDate, setSelectedDate] = useState(new Date());

  // The final dueDate string ('yyyy-MM-dd') to be submitted
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Update the final dueDate whenever the selectedDate or taskType changes
  useEffect(() => {
    setDueDate(format(selectedDate, 'yyyy-MM-dd'));
  }, [selectedDate]);


  // --- Logic to generate dropdown options ---
  const currentYear = getYear(new Date());
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const weeksOfMonth = getWeeksInMonth(selectedDate);
  const weeks = Array.from({ length: weeksOfMonth }, (_, i) => i + 1);

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !dueDate) {
      alert('Please select a title and a valid date/week/month.');
      return;
    }
    const newTask = { title, taskType, completed: false, dueDate };
    onTaskAdd(newTask);
    setTitle('');
  };

  // This function decides which inputs to show
  const renderDateInputs = () => {
    if (taskType === 'Daily') {
      return (
        <input 
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      );
    }
    
    // For Weekly and Monthly, we show Year and Month selectors
    return (
      <>
        <select value={getYear(selectedDate)} onChange={(e) => setSelectedDate(setYear(selectedDate, parseInt(e.target.value)))}>
          {years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>
        <select value={getMonth(selectedDate)} onChange={(e) => setSelectedDate(setMonth(selectedDate, parseInt(e.target.value)))}>
          {months.map(monthIndex => (
            <option key={monthIndex} value={monthIndex}>
              {format(new Date(currentYear, monthIndex), 'MMMM')}
            </option>
          ))}
        </select>
        {/* For Weekly, we add the week selector */}
        {taskType === 'Weekly' && (
          <select value={dueDate} onChange={(e) => setDueDate(e.target.value)}>
            <option value="">Select a week</option>
            {weeks.map(weekNum => {
              const weekStartDate = startOfWeek(addWeeks(startOfMonth(selectedDate), weekNum - 1), { weekStartsOn: 1 });
              return (
                <option key={weekNum} value={format(weekStartDate, 'yyyy-MM-dd')}>
                  Week {weekNum}
                </option>
              )
            })}
          </select>
        )}
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
        <option value="Daily">Daily</option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
      </select>
      
      {renderDateInputs()}

      <button type="submit">Add Task</button>
    </form>
  );
}

export default AddTaskForm;