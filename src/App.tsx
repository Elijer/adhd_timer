import { useState } from "react";
import "./App.css";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableStyle,
  DropResult,
} from "@hello-pangea/dnd";

function App() {
  const navItems = ["Importance", "Urgency", "Chart"];

  type Task = {
    id: string;
    content: string;
  };

  const pad = 8;

  const getItemStyle = (
    isDragging: boolean,
    draggableStyle?: DraggableStyle
  ): React.CSSProperties => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: pad,
    margin: `0 0 ${pad}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const initialTasks: Task[] = [
    {
      id: "item-1",
      content: "thingy",
    },
    {
      id: "item-2",
      content: "other thing",
    },
    {
      id: "item-3",
      content: "yet other guy",
    },
  ];

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // TODO bring this back when uncommenting things
  const handleNewTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const taskName = form.elements.namedItem("taskName") as HTMLInputElement;
    const newTask = taskName.value;
    setTasks((currentTasks: Task[]) => [
      ...currentTasks,
      {
        id: newTask,
        content: newTask,
      },
    ]);
  };

  // a little function to help us with reordering the result
  const reorder = (
    list: Task[],
    startIndex: number,
    endIndex: number
  ): Task[] => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    const reorderedTasks = reorder(
      tasks,
      result.source.index,
      result.destination.index
    );

    setTasks(reorderedTasks);
  }

  return (
    <div>
      <div className="header .pt-sans-regular">
        <span className="nav-item nav-title">Eisenhower</span>
        {navItems.map((navItem) => {
          return <span className="nav-item">{navItem}</span>;
        })}
      </div>
      <div className="view">
        <h1>Importance</h1>
        <p className="add-task">
          <form onSubmit={handleNewTask}>
            <input type="text" name="taskName" placeholder="name" />
            <input type="submit" placeholder="task name" />
          </form>
        </p>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(droppableProvided, droppableSnapshot) => {
              console.log(console.log(droppableSnapshot));
              return (
                <div
                  ref={droppableProvided.innerRef}
                  style={{ padding: "100px" }}
                >
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          {task.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {droppableProvided.placeholder}
                </div>
              );
            }}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
