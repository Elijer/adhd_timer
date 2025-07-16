import { useState } from "react";
import "./App.css";
import "./index.css";
import { Box, Button, TextField, VisuallyHidden } from "@radix-ui/themes";
import {
  ArrowDownIcon,
  MagnifyingGlassIcon,
  Pencil1Icon,
  StarFilledIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
} from "@radix-ui/react-icons";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableStyle,
  DropResult,
} from "@hello-pangea/dnd";

import { i, id, init } from "@instantdb/react";
import schema from "../instant.schema";

const APP_ID = import.meta.env.VITE_INSTANT_APP_ID;
const db = init({ appId: APP_ID, schema });

function formatMinutes(time: number) {
  const m = Math.floor(time);
  return `${m.toString().padStart(2, "0")}:00`;
}

function App() {
  const { isLoading, error, data } = db.useQuery({ todos: {} });
  const [newText, setNewText] = useState("");
  const [newMinutes, setNewMinutes] = useState("");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const todos = data.todos;

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !newMinutes) return;
    db.transact(
      db.tx.todos[id()].update({
        text: newText,
        done: false,
        time: Number(newMinutes),
        createdAt: new Date(),
      })
    );
    setNewText("");
    setNewMinutes("");
  };

  const handleDelete = (todo: any) => {
    db.transact(db.tx.todos[todo.id].delete());
  };

  // a little function to help us with reordering the result
  const reorder = (
    list: any[],
    startIndex: number,
    endIndex: number
  ): any[] => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    const reorderedTodos = reorder(
      todos,
      result.source.index,
      result.destination.index
    );

    // No need to update state here, InstantDB handles live updates
    // setTodos(reorderedTodos);
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

    // This function is no longer needed as InstantDB handles state
    // setTodos((prevTodos) =>
    //   prevTodos.map((todo) => {
    //     if (todo.id !== taskId) return todo;

    //     const updatedScores = [...todo.scores];
    //     updatedScores[scoreIndex] = newScore;

    //     return { ...todo, scores: updatedScores };
    //   })
    // );
  }

  return (
    <div className="flex flex-col items-center h-screen bg-sand-100 py-20 px-4">
      <div className="w-full max-w-5xl">
        <form onSubmit={handleAddTodo} className="flex text-5xl mb-36 mt-36 max-w">
          <div className="flex mx-auto w-full gap-4">
            <input
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              type="text"
              placeholder="add a task"
              name="taskName"
              value={newText}
              onChange={e => setNewText(e.target.value)}
              className="w-full pr-4 py-5 text-sand bg-sand-100 outline-none focus:border-higlight focus:text-sand border-b-1 pb-0"
            />
            <input
              type="number"
              min={1}
              placeholder="min"
              value={newMinutes}
              onChange={e => setNewMinutes(e.target.value)}
              className="w-32 px-2 py-5 text-sand bg-sand-100 outline-none focus:border-higlight border-b-1 pb-0"
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
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(droppableProvided) => (
                <div ref={droppableProvided.innerRef} className="border-b-1 border-sand">
                  {todos.map((todo: any, index: number) => (
                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex-1 p-10 border-1 text-3xl outline-none border-sand text-sand bg-sand-200 border-b-0"
                        >
                          <div className="flex w-full items-center justify-between gap-1">
                            <div className="flex-1 truncate whitespace-nowrap text-ellipsis overflow-hidden">
                              {todo.text}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="w-24 text-right">{formatMinutes(todo.time)}</span>
                              <button onClick={() => handleDelete(todo)} className="hover:text-red-500">
                                <TrashIcon className="w-8 h-8" />
                                <VisuallyHidden>Delete</VisuallyHidden>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

export default App;
