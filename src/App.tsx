import { useState } from 'react'
import './App.css'

function App() {

  const [tasks, setTasks] = useState<string[]>([])

  let navItems = ["Importance", "Urgency", "Chart"]


  let handleNewTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.target as HTMLFormElement;
    const taskName = form.elements.namedItem("taskName") as HTMLInputElement;
    let newTask = taskName.value

    setTasks((currentTasks) => [...currentTasks, newTask])
    taskName.value = ''
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
                </tr>
              </thead>
              <tbody>
              {tasks?.map((task) => {
                  return (
                    <tr>
                      <td>{task}</td>
                    </tr>
                  );
              })}
              </tbody>
            </table>
        <p className = "add-task">
          <form onSubmit={handleNewTask}>
            <input type="text" name="taskName" placeholder="name" />
            <input type="submit" placeholder="task name" />
          </form>
        </p>
      </div>
    </>
  )
}

export default App
