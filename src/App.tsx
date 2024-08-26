import { useState } from 'react'
import './App.css'

function App() {

  class Task {

    title: string;
    importance: number | null;
    urgency: number | null;

    constructor(title: string, importance: number | null = null, urgency: number | null = null){
      this.title = title
      this.importance = importance
      this.urgency = urgency
    }
  }

  const [page, setPage] = useState(0)
  const [tasks, setTasks] = useState<Task[]>()

  let navItems = ["Importance", "Urgency", "Chart"]


  let handleNewTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.target as HTMLFormElement;
    const taskName = form.elements.namedItem("taskName") as HTMLInputElement;
    // const taskImportance = form.elements.namedItem("taskImportance") as HTMLInputElement;
    // const taskUrgency = form.elements.namedItem("taskUrgency") as HTMLInputElement;

    // let newTask = new Task(taskName.value, parseInt(taskImportance.value) ?? 0, parseInt(taskUrgency.value) ?? 0)
    let newTask = new Task(taskName.value, 0, 0)
    setTasks((currentTasks) => [...(currentTasks || []), newTask])
    taskName.value = ''
    // taskImportance.value = ''
    // taskUrgency.value = ''
  }

  return (
    <>
      <div className="header .pt-sans-regular">
        <span className = "nav-item nav-title">Eisenhower</span>
        {navItems.map((navItem) => {
          return (
            <span className = "nav-item">{navItem}</span>
          )
        })}
      </div>
      <div className = "view">
        <h1>Importance</h1>
            <table className="task-table">
              <thead>
                <tr>
                  <th>Title</th>
                  {/* <th>Importance</th>
                  <th>Urgency</th> */}
                </tr>
              </thead>
              <tbody>
              {tasks?.map((task) => {
                  return (
                    <tr>
                      <td>{task.title}</td>
                      {/* <td>{task.importance}</td>
                      <td>{task.urgency}</td> */}
                    </tr>
                  );
              })}
              </tbody>
            </table>
        <p className = "add-task">
          <form onSubmit={handleNewTask}>
            <input type="text" name="taskName" placeholder="name" />
            {/* <input type="number" name="taskImportance" placeholder="importance" />
            <input type="number" name="taskUrgency" placeholder="urgency" /> */}
            <input type="submit" placeholder="task name" />
          </form>
        </p>
      </div>
    {/* <div className = "header">

      <div className = "nav">
        {navItems.map((navItem) => {
          return (
            <span className = "nav-item">{navItem}</span>
          )
        })}
      </div>
    </div> */}
      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
