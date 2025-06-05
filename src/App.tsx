import { useState, useRef } from "react";
import "./App.css";
import "./index.css";
import { Box, Button, TextField, VisuallyHidden } from "@radix-ui/themes";
import {
  ArrowDownIcon,
  MagnifyingGlassIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";

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
    scores: (number | "")[];
  };

  const initialTasks: Task[] = [
    {
      id: "1",
      content: "thingy",
      scores: [0, 0, 0],
    },
    {
      id: "2",
      content: "other thing",
      scores: [0, 0, 0],
    },
    {
      id: "3",
      content: "yet other guy",
      scores: [0, 0, 0],
    },
  ];

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [tempVal, setTempVal] = useState<number | "">("");
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
        scores: [0, 0, 0],
      },
    ]);
    console.log(tasks[tasks.length - 1]);
    taskName.value = "";
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

  function getAdditionalDragStyle(isDragging: boolean): string {
    // let baseStyle =
    //   "flex-1 p-10 border-1 text-3xl outline-none border-sand text-sand ";
    const values = isDragging ? "bg-sand-300" : "bg-sand-200 border-b-0";
    return " " + values;
  }

  function handleScoreChange(
    e: React.ChangeEvent<HTMLInputElement>,
    taskId: string,
    scoreIndex: number
  ) {
    const newScore = parseInt(e.target.value) || "";

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) return task;

        const updatedScores = [...task.scores];
        updatedScores[scoreIndex] = newScore;

        return { ...task, scores: updatedScores };
      })
    );
  }

  return (
    <div className="flex flex-col items-center h-screen bg-sand-100 py-20 px-4">
      <div className="w-full max-w-5xl">
        <form
          onSubmit={makeNewTask}
          className="flex text-5xl mb-36 mt-36 max-w"
        >
          <div className="flex mx-auto w-full">
            <input
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              type="text"
              placeholder="add a task"
              name="taskName"
              className="w-full pr-4 py-5 text-sand bg-sand-100 outline-none focus:border-higlight focus:text-sand border-b-1 pb-0"
            />
            <button
              type="submit"
              className="text-xs gap-2 px-8 py-5 text-sand border-b-1 bg-forward cursor-pointer transition hover:bg-sand hover:text-sand-200"
            >
              <Pencil1Icon className="w-10 h-10 mt-2" />
              <VisuallyHidden>add</VisuallyHidden>
            </button>
          </div>
        </form>

        <div>
          {/* className="flex gap-2 items-center text-5xl mb-8 mt-12" */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(droppableProvided, droppableSnapshot) => {
                return (
                  <div
                    ref={droppableProvided.innerRef}
                    className="border-b-1 border-sand"
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
                            className={`flex-1 p-10 border-1 text-3xl outline-none border-sand text-sand ${getAdditionalDragStyle(
                              snapshot.isDragging
                            )}`}
                          >
                            <div className="flex w-full items-center justify-between gap-4">
                              {/* Left-side text that can shrink but not wrap */}
                              <div className="flex-1 truncate whitespace-nowrap text-ellipsis overflow-hidden">
                                {task.content}
                              </div>

                              {/* Right-side number inputs */}
                              <div className="flex gap-2 shrink-0">
                                {/* <input
                                  value={0}
                                  type="number"
                                  className="w-16 px-2 py-1 text-right text-sand-300h"
                                /> */}
                                <input
                                  type="number"
                                  value={task.scores[0]}
                                  onChange={(e) =>
                                    handleScoreChange(e, task.id, 0)
                                  }
                                  onFocus={() => {
                                    setTempVal(task.scores[0]);
                                    setTasks(
                                      (tasks) =>
                                        tasks.map((t) => {
                                          if (t.id === task.id)
                                            t.scores[0] = "";
                                          console.log(t);
                                          console.log(task);
                                          return t;
                                        })
                                      // tasks.map((currentTask) => {
                                      //   console.log(currentTask);
                                      //   if ((currentTask.id = task.id)) {
                                      //     task.scores[0] = "";
                                      //   }
                                      //   return task;
                                      // })
                                    );
                                  }}
                                  onBlur={() => {
                                    setTasks(
                                      (tasks) =>
                                        tasks.map((t) => {
                                          if (
                                            t.id === task.id &&
                                            task.scores[0] === ""
                                          )
                                            t.scores[0] = tempVal;
                                          return t;
                                        })
                                      // tasks.map((currentTask) => {
                                      //   console.log(currentTask);
                                      //   if ((currentTask.id = task.id)) {
                                      //     task.scores[0] = "";
                                      //   }
                                      //   return task;
                                      // })
                                    );
                                    setTempVal("");
                                  }}
                                  className="
                                    w-20 px-3 py-2
                                    text-right text-sand 
                                    border-b-2 border-transparent
                                    focus:outline-none focus:ring-0 focus:border-sand
                                    appearance-none
                                    [&::-webkit-inner-spin-button]:appearance-none
                                    bg-transparent
                                  "
                                />
                                {/* <input
                                  value={0}
                                  type="number"
                                  className="w-16 px-2 py-1 text-right text-sand-300h"
                                /> */}
                              </div>
                            </div>
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
