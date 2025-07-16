# Implement todo features and countdown timer
_Exported on 7/16/2025 at 10:51:04 EDT from Cursor (1.2.4)_

---

**User**

Okay so here's what I did, I added an INSTANT_DB id into the .env.

I want to do something pretty simple/

So I added the todos into the instant.schema.ts,

And now what I need you to do is to make sure that adding todos will add the appropriate info and deleting them will, you know delete them

Se we need to add a trashcan icon that deletes a todo, 

And additionally, on the input line, I need to add an ADDITIONAL field that allow sthe user to input a number of minutes.

When the new todo is submitted, the time is saved as just a straight up number into time.

Then, for the actual display of the todos, add a column that shows the time in minutes (so with :00)

And there should be a play icon (the triangle), and if that is pressed, then the numer of minutes starts counting down.

If the minutes hits 0, there should be an alarm sound of really any kind.

Also, if the play button on one task is hit, any other todo that is in a play state should be paused.

Also, while playing, every ten seconds, the "time" field on a todo should be updated to reflect the current todo state countdown.

Can you do these things?


---

**Cursor**

Here’s a concise breakdown of what you want to achieve:

1. **Add a trashcan icon to each todo for deletion.**
2. **Add a number input for minutes when creating a todo.**
3. **Display the time in minutes (e.g., 25:00) in the todo list.**
4. **Add a play (triangle) icon to start a countdown timer for each todo.**
5. **Only one timer can run at a time; starting one pauses any other.**
6. **When the timer hits 0, play an alarm sound.**
7. **While playing, update the "time" field in the DB every 10 seconds.**

Let’s break this into actionable steps:

---

### TODO List

1. **Update the UI to add:**
   - Trashcan icon for deletion.
   - Number input for minutes when adding a todo.
   - Display of time in minutes (MM:SS) for each todo.
   - Play icon for each todo to start/pause the timer.

2. **Implement logic:**
   - Deleting a todo removes it from the DB.
   - Adding a todo saves the text and the time (in minutes as a number).
   - Timer logic: only one active at a time, updates every 10s, stops at 0, plays alarm.
   - Update the "time" field in the DB every 10 seconds while the timer is running.

3. **Add alarm sound when timer hits 0.**

---

I’ll start by checking your current todo UI and logic (likely in `src/App.tsx`), then implement the above features step by step.

Let’s begin by reviewing your current todo UI and logic.

Here’s a summary of what we have and what needs to change:

### Current State
- Todos are managed locally in state as `tasks`.
- Each task has an `id`, `content`, and `scores` (array of numbers).
- There’s a form to add a new task (just text).
- Tasks are displayed in a draggable list.
- There’s a number input for scores, but not for time/minutes.
- No delete, play, or timer functionality yet.
- No DB integration (InstantDB) for todos.

---

### What We Need to Do

1. **Switch to using InstantDB for todos** (instead of local state).
2. **Add a number input for minutes** when creating a todo.
3. **Display time in MM:SS format** for each todo.
4. **Add a trashcan icon** to delete a todo.
5. **Add a play icon** to start/pause a countdown timer for each todo.
6. **Only one timer can run at a time**; starting one pauses any other.
7. **When timer hits 0, play an alarm sound.**
8. **While playing, update the "time" field in the DB every 10 seconds.**

---

#### Next Steps

- Integrate InstantDB for todos (fetch, add, delete, update).
- Update the add-todo form to include a minutes input.
- Update the todo display to show time, play, and delete icons.
- Implement timer logic and alarm.

---

**Let’s start by integrating InstantDB for todos and updating the add-todo form.**

We have all the info needed to proceed. Here’s the plan for the first step:

---

### Step 1: Integrate InstantDB for Todos

- **Initialize InstantDB** in your app using your APP_ID and schema.
- **Replace local state** for todos with InstantDB’s `useQuery` for live data.
- **Add, delete, and update todos** using InstantDB’s `transact` API.

---

### Step 2: Update the Add-Todo Form

- Add a number input for minutes.
- When submitting, save the text and the time (in minutes) to the DB.

---

### Step 3: Update Todo Display

- Show the time in MM:SS format.
- Add a trashcan icon for deletion.
- Add a play icon for the timer.

---

I’ll start by editing `src/App.tsx` to:
- Initialize InstantDB.
- Use live todos from the DB.
- Add the minutes input.
- Add add/delete logic.

Let’s implement these foundational changes first.

```typescriptreact
// ... existing code ...
import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/themes";
import { Pencil1Icon, StarFilledIcon, TrashIcon, PlayIcon, PauseIcon } from "@radix-ui/react-icons";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
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

  // ... existing code ...
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
          <DragDropContext onDragEnd={() => {}}>
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
// ... existing code ...

```

- Integrated InstantDB for todos (live query, add, delete)
- Added a minutes input to the add-todo form
- Displayed time in MM:00 format
- Added a trashcan icon for deleting todos

Next steps will be to add the play/pause timer logic, alarm, and DB time updates. Let me know if you want to review or keep going!

---

**User**

The .env has

INSTANT_DB

For app_id

---

**Cursor**

Thanks for clarifying!  
You have your app ID in the `.env` file as:

```
INSTANT_DB=your-app-id-here
```

To use this in your Vite React app, you should:

1. **Rename the variable to follow Vite’s convention:**  
   Vite only exposes environment variables prefixed with `VITE_` to your frontend code.

   So, update your `.env` to:
   ```
   VITE_INSTANT_DB=your-app-id-here
   ```

2. **Update the code to use the correct variable:**  
   In `src/App.tsx`, change:
   ```ts
   const APP_ID = import.meta.env.VITE_INSTANT_APP_ID;
   ```
   to:
   ```ts
   const APP_ID = import.meta.env.VITE_INSTANT_DB;
   ```

---

**Summary of what to do:**
- Rename your `.env` variable to `VITE_INSTANT_DB`
- Update the code to use `import.meta.env.VITE_INSTANT_DB`

Would you like me to make this code change for you?

```plaintext
INSTANT_DB=your-app-id-here
```

```plaintext
   VITE_INSTANT_DB=your-app-id-here
```

```typescript
   const APP_ID = import.meta.env.VITE_INSTANT_APP_ID;
```

```typescript
   const APP_ID = import.meta.env.VITE_INSTANT_DB;
```

