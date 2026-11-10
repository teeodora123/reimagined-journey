import { useState, useEffect } from "react";
import TaskItem from "./components/TaskItem.jsx";
import {STATUS, BACKGROUNDS, CHILL_BACKGROUND } from "./constants.js";

function App() {
    const [tasks, setTasks] = useState([]);
    const [newText, setNewText] = useState("");
    const [message, setMessage] = useState("");
    const [background,setBackground] = useState("Forest");

    const activeTask = tasks.find((task) => task.status === STATUS.IN_PROGRESS )
    const isBusy = activeTask !== undefined;

    useEffect(()=>{
        if(!isBusy) return;

        const interval = setInterval(()=>{
            setTasks((oldTasks)=>
                oldTasks.map((task)=>
                    task.status=== STATUS.IN_PROGRESS? {...task, seconds: task.seconds +1}: task)
            );
        },1000);

        return()=> clearInterval(interval);
    },[isBusy]);

    function addTask(event){
        event.preventDefault();
        if(newText.trim() === "") return;

        const task = {id: Date.now(), text: newText, status: STATUS.TODO, seconds: 0};
        setTasks([...tasks, task]);
        setNewText("");
    }

    function changeStatus(id, status){
        setTasks(
            tasks.map((task)=> (task.id === id ? {...task, status: status}: task))
        );
    }

    function finishTask(id){
        const finished = tasks.find((task)=> task.id=== id);
        const others = tasks.filter((task)=> task.id !== id);

        setTasks([...others, {...finished, status: STATUS.DONE}]);
        setMessage(`Well done! You finished " ${finished.text}"`);
        setTimeout(()=>setMessage(""), 3000);
    }

    const backgroundImage = isBusy ? BACKGROUNDS[background] : CHILL_BACKGROUND;
    return(
        <div className="min-h-screen bg-gray-100 bg-cover bg-center bg-fixed p-8" style={{backgroundImage: `url(${backgroundImage})`}}>
            {message && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 rounded-lg bg-green-500 px-6 py-3 text-white shadow-lg">
                    {message}
                </div>
            )}
            <div className="mx-auto max-w-md rounded-xl bg-white/90 p-6 shadow-lg">
                <h1 className="mb-4 text-2xl font-bold">My tasks</h1>
                <form onSubmit={addTask} className="mb-4 flex gap-2">
                    <input value={newText} onChange={(event) => setNewText(event.target.value)}
                           placeholder = "What do you need to do?" className="flex-1 rounded border px-3 py-2">
                    </input>
                    <button className="rounded bg-blue-500 px-4 py-2 text-white">
                        Add
                    </button>
                </form>

                {isBusy && (
                    <select value={background} onChange={(event)=> setBackground(event.target.value)} className="mb-4 w-full rounded border bg-white px-3 py-2">
                        {Object.keys(BACKGROUNDS).map((name)=> (
                            <option key={name}>{name}</option>
                        ))}
                    </select>
                )}

                <ul className="space-y-2">
                    {tasks.map((task)=> (
                        <TaskItem
                        key={task.id}
                        task={task}
                        isBusy={isBusy}
                        changeStatus={changeStatus}
                        finishTask={finishTask}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
