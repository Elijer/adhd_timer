import { useState, useEffect, useRef } from "react";
import "./App.css";
import "./index.css";
import { VisuallyHidden } from "@radix-ui/themes";
import {
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
  DropResult,
} from "@hello-pangea/dnd";

import { id, init } from "@instantdb/react";
import schema from "../instant.schema";

const APP_ID = import.meta.env.VITE_INSTANT_DB;
const db = init({ appId: APP_ID, schema });

function formatMinutes(timeInSeconds: number, showSeconds: boolean = false) {
  if (showSeconds) {
    // Show as MM:SS when counting down
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  } else {
    // Show as MM:SS for static display too, based on seconds
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
}

function formatTotalTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.ceil((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function App() {
  const { isLoading, error, data } = db.useQuery({ todos: {} });
  const [newText, setNewText] = useState("");
  const [newMinutes, setNewMinutes] = useState("");
  const [activeTimerId, setActiveTimerId] = useState<string | null>(null);
  const [localTimes, setLocalTimes] = useState<Record<string, number>>({});
  const intervalRef = useRef<number | null>(null);
  const dbUpdateRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio for alarm - moved before early returns ^
  useEffect(() => {
    // Create a simple beep sound using Web Audio API ^
    const createBeepSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800; // 800 Hz beep
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    };

    audioRef.current = { play: createBeepSound } as any;
  }, []);

  // Timer logic - count down every second - moved before early returns ^
  useEffect(() => {
    if (!activeTimerId) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (dbUpdateRef.current) clearInterval(dbUpdateRef.current);
      return;
    }

    const activeTodo = todos.find((todo: any) => todo.id === activeTimerId);
    if (!activeTodo) {
      setActiveTimerId(null);
      return;
    }

    // Initialize local time in seconds if not set (time is now stored in seconds) ^
    if (!(activeTimerId in localTimes)) {
      setLocalTimes(prev => ({ ...prev, [activeTimerId]: activeTodo.time as number }));
    }

    // Update UI every second ^
    intervalRef.current = setInterval(() => {
      setLocalTimes(prev => {
        const currentTime = prev[activeTimerId] ?? (activeTodo.time as number);
        const newTime = Math.max(0, currentTime - 1);
        
        // Check if timer reached 0 ^
        if (newTime === 0) {
          setActiveTimerId(null);
          if (audioRef.current) {
            audioRef.current.play();
          }
        }
        
        return { ...prev, [activeTimerId]: newTime };
      });
    }, 1000); // Update every second

    // Update database every 20 seconds ^
    dbUpdateRef.current = setInterval(() => {
      setLocalTimes(prev => {
        const currentTimeInSeconds = prev[activeTimerId];
        if (currentTimeInSeconds !== undefined) {
          // Time is now stored directly in seconds ^
          db.transact(
            db.tx.todos[activeTimerId].update({ time: currentTimeInSeconds })
          );
        }
        return prev;
      });
    }, 20000); // Update DB every 20 seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (dbUpdateRef.current) clearInterval(dbUpdateRef.current);
    };
  }, [activeTimerId, data?.todos, localTimes]);

  // All hooks called above this point - now safe for early returns ^
  const todos = data?.todos || [];

  // Calculate total time for all todos (time is now in seconds, convert for display) ^
  const totalSeconds = todos.reduce((sum: number, todo: any) => sum + todo.time, 0);

  // Early returns after all hooks ^
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !newMinutes) return;
    // Convert minutes input to seconds for storage ^
    const timeInSeconds = Number(newMinutes) * 60;
    db.transact(
      db.tx.todos[id()].update({
        text: newText,
        done: false,
        time: timeInSeconds,
        createdAt: new Date(),
      })
    );
    setNewText("");
    setNewMinutes("");
  };

  const handleDelete = (todo: any) => {
    if (activeTimerId === todo.id) {
      setActiveTimerId(null);
    }
    // Clean up local time state ^
    setLocalTimes(prev => {
      const newTimes = { ...prev };
      delete newTimes[todo.id];
      return newTimes;
    });
    db.transact(db.tx.todos[todo.id].delete());
  };

  const handleToggleTimer = (todo: any) => {
    if (activeTimerId === todo.id) {
      // Pause current timer and save current time to DB in seconds ^
      const currentTimeInSeconds = localTimes[todo.id] ?? todo.time;
      db.transact(
        db.tx.todos[todo.id].update({ time: currentTimeInSeconds })
      );
      setActiveTimerId(null);
    } else {
      // Start new timer (stops any other running timer) ^
      setActiveTimerId(todo.id);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    // Drag and drop logic can be implemented later if needed ^
  };

  return (
    <div className="flex flex-col items-center h-screen bg-sand-100 py-20 px-4">
      <div className="w-full max-w-5xl">
        {/* Total Time Display ^ */}
        <div className="text-center mb-8">
          <h1 className="text-4xl text-sand-700 mb-2">Total Time</h1>
          <div className="text-6xl text-sand font-bold">
            {formatTotalTime(totalSeconds)}
          </div>
        </div>

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
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(droppableProvided) => (
                <div ref={droppableProvided.innerRef} className={`${todos && todos.length > 0 ? 'border-b-1 border-sand' : ''}`}>
                  {todos.map((todo: any, index: number) => (
                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`flex-1 p-10 border-1 text-3xl outline-none border-sand text-sand border-b-0 ${
                            activeTimerId === todo.id ? 'bg-sand-300' : 'bg-sand-200'
                          }`}
                        >
                          <div className="flex w-full items-center justify-between gap-1">
                            <div className="flex-1 truncate whitespace-nowrap text-ellipsis overflow-hidden">
                              {todo.text}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`w-24 text-right ${(localTimes[todo.id] ?? todo.time) === 0 ? 'text-red-500 font-bold' : ''}`}>
                                {activeTimerId === todo.id 
                                  ? formatMinutes(localTimes[todo.id] ?? todo.time, true)
                                  : formatMinutes(todo.time, false)
                                }
                              </span>
                              <button 
                                onClick={() => handleToggleTimer(todo)} 
                                className="hover:text-blue-500"
                                disabled={(localTimes[todo.id] ?? todo.time) === 0}
                              >
                                {activeTimerId === todo.id ? (
                                  <PauseIcon className="w-8 h-8" />
                                ) : (
                                  <PlayIcon className="w-8 h-8" />
                                )}
                                <VisuallyHidden>
                                  {activeTimerId === todo.id ? 'Pause' : 'Play'}
                                </VisuallyHidden>
                              </button>
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
