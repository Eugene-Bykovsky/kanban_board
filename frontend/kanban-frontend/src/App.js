import {useEffect, useState} from "react";
import './App.css'
import api from './Api';

function App() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await api.getTasks();
        console.error("Ответ от апи:", tasks);

        // Создание массива boards с данными из базы данных
        const boards = [
          {id: 1, title: "new", items: []},
          {id: 2, title: "in progress", items: []},
          {id: 3, title: "completed", items: []}
        ];

        // Перебор полученных задач и распределение их по соответствующим колонкам
        tasks.forEach(task => {
          const boardIndex = boards.findIndex(board => board.title === task.status);
          if (boardIndex !== -1) {
            boards[boardIndex].items.push({
              id: task.id,
              title: task.title,
              // Добавьте другие необходимые поля, например, description
            });
          } else {
            console.error(`Не найдена колонка для задачи с id ${task.id} и статусом ${task.status}`);
          }
        });

        // Сохранение полученного массива boards в state
        setBoards(boards);
      } catch (error) {
        console.error("Ошибка при получении задач:", error);
      }
    };

    fetchTasks();
  }, []);

  const [currentBoard, setCurrentBoard] = useState(null)
  const [currentItem, setCurrentItem] = useState(null)

  function dragOverHandler(e, board, item) {
    e.preventDefault()
    if(e.target.className === 'item') {
      e.target.style.boxShadow = '0 4px 3px gray'
    }
  }

  function dragLeaveHandler(e) {
    e.target.style.boxShadow = 'none'
  }

  function dragEndHandler(e) {
    e.target.style.boxShadow = 'none'
  }

  function dropHandler(e, board, item) {
    e.preventDefault()
    e.stopPropagation()
    const currentIndex = currentBoard.items.indexOf(currentItem)
    currentBoard.items.splice(currentIndex, 1)
    const dropIndex = board.items.indexOf(item)
    board.items.splice(dropIndex + 1, 0, currentItem)
    setBoards(boards.map(b => {
      if (b.id === board.id) {
        return board
      }
      if (b.id === currentBoard.id) {
        return currentBoard
      }
      return b
    }))
    e.target.style.boxShadow = 'none'
  }

  function dragStartHandler(e, board, item) {
    setCurrentBoard(board)
    setCurrentItem(item)
  }


  function dropCardHandler(e, board) {
    board.items.push(currentItem)
    const currentIndex = currentBoard.items.indexOf(currentItem)
    currentBoard.items.splice(currentIndex, 1)
    setBoards(boards.map(b => {
      if (b.id === board.id) {
        return board
      }
      if (b.id === currentBoard.id) {
        return currentBoard
      }
      return b
    }))
    e.target.style.boxShadow = 'none'
  }

  return (
      <div className="app">
        {boards.map(board =>
            <div
                className="board"
                onDragOver={(e) => dragOverHandler(e)}
                onDrop={(e) => dropCardHandler(e, board)}
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
                        className="item">{item.title}</div>
                )}
            </div>
        )}
      </div>
  );
}

export default App;