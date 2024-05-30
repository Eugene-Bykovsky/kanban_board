import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

function Column({ columnId, tasks }) {
  return (
    <div className="Column">
      <h3>{columnId}</h3>
      {columnId === 'new' && (
        <Droppable droppableId="new">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="Column-droppable"
            >
              {tasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
      {columnId === 'in progress' && (
        <Droppable droppableId="in progress">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="Column-droppable"
            >
              {tasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
      {columnId === 'completed' && (
        <Droppable droppableId="completed">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="Column-droppable"
            >
              {tasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
}

function Task({ task, index }) {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="Task"
        >
          {task.title}
        </div>
      )}
    </Draggable>
  );
}

export default Column;
