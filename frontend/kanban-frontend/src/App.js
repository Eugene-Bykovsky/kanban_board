import { useEffect, useState } from "react";
import './App.css';
import api from './Api';

function App() {
  const [boards, setBoards] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskVisible, setNewTaskVisible] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await api.getTasks();
        console.error("Ответ от апи:", tasks);

        const boards = [
          { id: 1, title: "new", items: [] },
          { id: 2, title: "in progress", items: [] },
          { id: 3, title: "completed", items: [] }
        ];

        tasks.forEach(task => {
          const boardIndex = boards.findIndex(board => board.title === task.status);
          if (boardIndex !== -1) {
            boards[boardIndex].items.push({
              id: task.id,
              title: task.title,
              description: task.description
            })
          } else {
            console.error(`Не найдена колонка для задачи с id ${task.id} и статусом ${task.status}`);
          }
        });

        setBoards(boards);
      } catch (error) {
        console.error("Ошибка при получении задач:", error);
      }
    };

    fetchTasks();
  }, []);

  const [currentBoard, setCurrentBoard] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);

  function dragOverHandler(e) {
    e.preventDefault();
    if (e.target.className === 'item') {
      e.target.style.boxShadow = '0 4px 3px gray';
    }
  }

  function dragLeaveHandler(e) {
    e.target.style.boxShadow = 'none';
  }

  function dragEndHandler(e) {
    e.target.style.boxShadow = 'none';
  }

  async function dropHandler(e, board, item) {
    e.preventDefault();
    e.stopPropagation();
    const currentIndex = currentBoard.items.indexOf(currentItem);
    currentBoard.items.splice(currentIndex, 1);
    const dropIndex = board.items.indexOf(item);
    board.items.splice(dropIndex + 1, 0, currentItem);
    setBoards(boards.map(b => {
      if (b.id === board.id) {
        return board;
      }
      if (b.id === currentBoard.id) {
        return currentBoard;
      }
      return b;
    }));
    e.target.style.boxShadow = 'none';
  }

  async function dropCardHandler(e, board) {
    e.preventDefault();
    e.stopPropagation();
    if (!currentItem || !currentBoard) return;
    board.items.push(currentItem);
    const currentIndex = currentBoard.items.indexOf(currentItem);
    currentBoard.items.splice(currentIndex, 1);
    await updateTaskStatus(currentItem, board.title);
    setBoards(boards.map(b => {
      if (b.id === board.id) {
        return board;
      }
      if (b.id === currentBoard.id) {
        return currentBoard;
      }
      return b;
    }));
    e.target.style.boxShadow = 'none';
  }

  function dragStartHandler(e, board, item) {
    setCurrentBoard(board);
    setCurrentItem(item);
  }

  async function updateTaskStatus(task, newStatus) {
    try {
      const updatedTask = { ...task, status: newStatus };
      await api.updateTaskStatus(task.id, updatedTask);
    } catch (error) {
      console.error("Ошибка при обновлении статуса задачи:", error);
    }
  }

  const handleNewTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTask = await api.createTask({
        title: newTaskTitle,
        description: newTaskDescription,
        status: 'new'
      });
      const newBoards = [...boards];
      newBoards[0].items.push(newTask);
      setBoards(newBoards);
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (error) {
      console.error("Ошибка при создании задачи:", error);
    }
  };

  const toggleNewTaskVisibility = () => {
    setNewTaskVisible(!newTaskVisible);
  };

  return (
    <div className="app">
      <button onClick={toggleNewTaskVisibility}>
        {newTaskVisible ? "Свернуть блок создания задач" : "Создать новую задачу"}
      </button>
      {newTaskVisible && (
        <form onSubmit={handleNewTaskSubmit}>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task Title"
            required
          />
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Task Description"
            required
          />
          <button type="submit">Create Task</button>
        </form>
      )}
      <div className="boards-container">
        {boards.map(board =>
          <div
            className="board"
            onDragOver={(e) => dragOverHandler(e)}
            onDrop={(e) => dropCardHandler(e, board)}
            key={board.id}
          >
            <div className="board__title">{board.title}</div>
            {board.items.map(item =>
              <div
                draggable={true}
                onDragStart={(e) => dragStartHandler(e, board, item)}
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragEnd={(e) => dragEndHandler(e)}
                onDragOver={(e) => dragOverHandler(e)}
                onDrop={(e) => dropHandler(e, board, item)}
                className="item"
                key={item.id}
              >
                <div className="item__title">{item.title}</div>
                <div className="item__description">{item.description}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
