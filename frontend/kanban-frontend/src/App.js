import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import api from './api';
import './App.css';
import Column from './Column';

function App() {
  const [tasks, setTasks] = useState({
    'new': [],
    'in progress': [],
    'completed': [],
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const fetchedTasks = await api.getTasks();
      const newTasks = {
        'new': [],
        'in progress': [],
        'completed': [],
      };
      fetchedTasks.forEach(task => {
        newTasks[task.status].push({...task, index: newTasks[task.status].length});
      });
      setTasks(newTasks);
    };
    fetchTasks();
  }, []);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks[result.source.droppableId]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const newTasks = {
      ...tasks,
      [result.source.droppableId]: items,
    };

    if (result.destination.droppableId !== result.source.droppableId) {
      const targetItems = Array.from(tasks[result.destination.droppableId]);
      targetItems.splice(result.destination.index, 0, reorderedItem);
      newTasks[result.destination.droppableId] = targetItems;
      newTasks[result.source.droppableId] = items;

      // Обновление статуса задачи на сервере
      api.updateTaskStatus(reorderedItem.id, result.destination.droppableId);
    }

    setTasks(newTasks);
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    if (newTaskTitle.trim() === '') return;

    const createdTask = await api.createTask({
      title: newTaskTitle,
      status: 'new', // Создаем задачу со статусом 'new'
    });

    setTasks({
      ...tasks,
      new: [...tasks.new, { ...createdTask, index: tasks.new.length }],
    });

    setNewTaskTitle(''); // Очищаем поле ввода
  };

  return (
    <div className="App">
      <h1>Канбан-доска</h1>
      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          placeholder="Введите название задачи"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button type="submit">Добавить задачу</button>
      </form>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="KanbanBoard">
          {Object.entries(tasks).map(([columnId, columnTasks]) => (
            <Column key={columnId} columnId={columnId} tasks={columnTasks} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;