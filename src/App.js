import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import FilterBar from './components/FilterBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function TaskManagerHome({ token, handleLogout }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ mode: 'week', date: new Date() });
  const getAuthAxios = () => axios.create({ headers: { Authorization: `Bearer ${token}` } });

  const fetchTasks = () => {
    getAuthAxios().get('https://task-manager-api-vinod.onrender.com/api/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks!', error));
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const handleAddTask = (newTask) => {
    getAuthAxios().post('https://task-manager-api-vinod.onrender.com/api/tasks', newTask)
      .then(() => fetchTasks()) // Re-fetch all tasks to get the latest list
      .catch(error => console.error('Error creating task!', error));
  };
  
  const handleDeleteTask = (id) => {
    getAuthAxios().delete(`https://task-manager-api-vinod.onrender.com/api/tasks/${id}`)
      .then(() => setTasks(prevTasks => prevTasks.filter(task => task.id !== id)))
      .catch(error => console.error('Error deleting task!', error));
  };

  const handleUpdateTask = (id, updatedTask) => {
    getAuthAxios().put(`https://task-manager-api-vinod.onrender.com/api/tasks/${id}`, updatedTask)
      .then(response => setTasks(prevTasks => prevTasks.map(task => (task.id === id ? response.data : task))))
      .catch(error => console.error('Error updating task!', error));
  };

  return (
    <>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <AddTaskForm onTaskAdd={handleAddTask} />
      <FilterBar filter={filter} setFilter={setFilter} />
      <TaskList tasks={tasks} filter={filter} onDeleteTask={handleDeleteTask} onUpdateTask={handleUpdateTask} />
    </>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="App">
        <h1>Task Manager</h1>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={token ? <TaskManagerHome token={token} handleLogout={handleLogout} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;