import { useState, useRef } from "react";
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
    width: "500px",

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const initialTasks: Task[] = [
    {
      id: "1",
      content: "thingy",
    },
    {
      id: "2",
      content: "other thing",
    },
    {
      id: "3",
      content: "yet other guy",
    },
  ];

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const taskCounter = useRef(77);

  // TODO bring this back when uncommenting things
  const handleNewTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const taskName = form.elements.namedItem("taskName") as HTMLInputElement;
    const newTask = taskName.value;
    setTasks((currentTasks: Task[]) => [
      ...currentTasks,
      {
        id: newTask + taskCounter.current,
        content: newTask,
      },
    ]);
    console.log(tasks[tasks.length - 1]);
    taskCounter.current++;
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
          return (
            <span className="nav-item" key={navItem}>
              {navItem}
            </span>
          );
        })}
      </div>
      <div className="view">
        <h1 className="font-bold underline mt-1 lg:justify-">Importance</h1>
        <div className="add-task">
          <form
            onSubmit={handleNewTask}
            className="flex gap-2 items-center mt-4 mb-6"
          >
            <input
              type="text"
              name="taskName"
              placeholder="name"
              className="px-2 py-1 border rounded border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            />
            <input
              type="submit"
              placeholder="task name"
              className="px-4 py-1 bg-orange-600 text-white rounded hover:bg-yellow-700 transition"
            />
          </form>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(droppableProvided, droppableSnapshot) => {
              return (
                <div ref={droppableProvided.innerRef}>
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
                          className={`rounded-lg px-4 py-2 mb-2 shadow-md border ${
                            snapshot.isDragging
                              ? "bg-green-200 scale-105 transition-all duration-150"
                              : "bg-gray-100"
                          }`}
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
