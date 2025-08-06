import React from 'react';
import { format, parseISO, isSameDay, isSameWeek, isSameMonth } from 'date-fns';

function TaskList({ tasks, filter, onDeleteTask, onUpdateTask }) {
  if (!Array.isArray(tasks)) {
    return <div>Loading tasks...</div>;
  }

  const parseDate = (task) => task.dueDate ? parseISO(task.dueDate) : null;
  
  const filteredTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = parseDate(task);
    if (filter.mode === 'day') {
      return task.taskType === 'Daily' && isSameDay(filter.date, taskDate);
    }
    if (filter.mode === 'week') {
      return task.taskType === 'Weekly' && isSameWeek(filter.date, taskDate);
    }
    if (filter.mode === 'month') {
      return task.taskType === 'Monthly' && isSameMonth(filter.date, taskDate);
    }
    return false;
  });

  return (
    <div className="task-list-container">
      <h2>
        Displaying Tasks for: {format(filter.date, 'MMMM do, yyyy')} ({filter.mode} view)
      </h2>
      {filteredTasks.length === 0 ? (
        <div className="empty-state">No tasks for this period.</div>
      ) : (
        <ul>
          {filteredTasks.map(task => (
            <li key={task.id} className={task.completed ? 'task-completed' : ''}>
              <input type="checkbox" checked={task.completed} onChange={() => onUpdateTask(task.id, { ...task, completed: !task.completed })} />
              {task.title}
              <span className="task-type">{task.taskType}</span>
              <button onClick={() => onDeleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;