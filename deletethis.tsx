import { useState, useRef } from "react";
import "./App.css";
import "./index.css";
import { Box, Button, TextField } from "@radix-ui/themes";
import { ArrowDownIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableStyle,
  DropResult,
} from "@hello-pangea/dnd";

function App() {
  // const navItems = ["Importance", "Urgency", "Chart"];

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
  const makeNewTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const taskName = form.elements.namedItem("taskName") as HTMLInputElement;
    const newTask = taskName.value;
    if (!newTask.trim()) return;
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
    <div className="flex items-center justify-center h-screen bg-amber-50">
      <div className="view">
        {/* <h1 className="font-bold underline lg:justify-">Tasks</h1> */}
        <div className="add-task">
          <form
            onSubmit={makeNewTask}
            className="flex gap-2 items-center mb-10"
          >
            {/* <div className="flex w-full max-w-4xl"> */}
            {/* <div className="flex items-center bg-sand-200 border-sand border-1"> */}
            {/* <ArrowDownIcon className="w-10 h-10 text-gray-400 ml-10 text-sand" /> */}
            <input
              type="text"
              placeholder="task name here"
              className="flex-1 text-5xl px-8 py-5 text-sand bg-sand-200 outline-none focus:border-higlight focus:text-sand"
            />
          {/* </div> */}
            <input
              type="submit"
              value="new"
              className="
                    text-5xl px-8 py-5 border-1 border-l-0
                    text-bold bg-forward cursor-pointer 
                    transition rounded-none
                  "
            />
            {/* <Button
                type="submit"
                className="bg-sand-200 text-sand hover:text-azul hover:text-hl
                    text-5xl px-8 py-5 border-1 border-l-0 cursor-pointer rounded-none
                  "
              >
                add
              </Button> */}
            {/* </div> */}
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





































// v2

import { useState, useRef } from "react";
import "./App.css";
import "./index.css";
import { Button } from "@radix-ui/themes";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableStyle,
  DropResult,
} from "@hello-pangea/dnd";

function App() {
  // const navItems = ["Importance", "Urgency", "Chart"];

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
  const makeNewTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const taskName = form.elements.namedItem("taskName") as HTMLInputElement;
    const newTask = taskName.value;
    if (!newTask.trim()) return;
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
    <div className="flex items-center justify-center h-screen bg-amber-50">
      <div className="text-white p-10 rounded">
        <div className="view">
          <h1 className="font-bold underline mt-1 lg:justify-">Tasks</h1>
          <div className="add-task">
            <form
              onSubmit={makeNewTask}
              className="flex gap-2 items-center mb-10"
            >
              <div className="flex w-full max-w-4xl">
                <input
                  type="text"
                  name="taskName"
                  placeholder="name"
                  className="flex-1 text-5xl px-8 py-5 border-[3px] border-[#E69968] text-[#E69968] bg-[#FFE3AF] outline-none focus:border-[#d67d44] focus:text-[#d67d44]"
                />
                <input
                  type="submit"
                  value="new"
                  className="
                    text-5xl px-8 py-5 border-1 border-l-0
                    text-bold bg-forward cursor-pointer 
                    transition rounded-none
                  "
                />
              </div>
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
    </div>
  );
}

export default App;


---


Sorry this is really it:



            <div className="flex w-full max-w-4xl">
              {/* <input
                type="text"
                name="taskName"
                placeholder="task name here"
                className="flex-1 text-5xl px-8 py-5 border-1 border-sand text-sand bg-sand-200 outline-none focus:border-higlight focus:text-sand"
              /> */}
              <div className="flex items-center">
                <ArrowDownIcon className="w-5 h-5 text-gray-400 " />
                <input
                  type="text"
                  placeholder="task name here"
                  className="flex-1 text-5xl px-8 py-5 border-1 text-sand bg-sand-200 outline-none focus:border-higlight focus:text-sand"
                />
              </div>
              <Button
                type="submit"
                className="bg-sand-200 text-sand hover:text-azul hover:text-hl
                    text-5xl px-8 py-5 border-1 border-l-0 cursor-pointer rounded-none
                  "
              >
                add
              </Button>
            </div>