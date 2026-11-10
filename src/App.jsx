import { useState, useEffect } from "react";

const CHILL_BACKGROUND = "https://images.unsplash.com/photo-1475694867812-f82b8696d610?w=1920&q=80";

const BACKGROUNDS = {
    Forest: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80",
    Beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
    Mountains: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    "Night forest": "https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=1920&q=80",
};

function formatTime(seconds){
    const minutes = Math.floor(seconds/60);
    const secs = seconds % 60;
    return `${minutes}:${String(secs).padStart(2,"0")}`;
}

function App() {
    const [tasks, setTasks] = useState([]);
    const [newText, setNewText] = useState("");
    const [message, setMessage] = useState("");
    const [background,setBackground] = useState("Forest");

    const activeTask = tasks.find((task) => task.status === "in-progress" )
    const isBusy = activeTask !== undefined;

    useEffect(()=>{
        if(!isBusy) return;

        const interval = setInterval(()=>{
            setTasks((oldTasks)=>
                oldTasks.map((task)=>
                    task.status==="in-progress" ? {...task, seconds: task.seconds +1}: task)
            );
        },1000);

        return()=> clearInterval(interval);
    },[isBusy]);

    function addTask(event){
        event.preventDefault();
        if(newText.trim() === "") return;

        const task = {id: Date.now(), text: newText, status: "todo", seconds: 0};
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

        setTasks([...others, {...finished, status: "done"}]);
        setMessage(`Well done! You finished " ${finished.text}"`);
        setTimeout(()=>setMessage(""), 3000);
    }

    const backgroundImage = isBusy ? BACKGROUNDS[background] : CHILL_BACKGROUND;
    return(
        <div className="min-h-screen bg-gray-100 bg-cover bg-center BG-FIXED p-8" style={{backgroundImage: `url(${backgroundImage})`}}>
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
                        <li key = {task.id} className="flex items-center gap-2 rounded border bg-white p-3">
                            <span className={task.status === "done" ? "flex-1 text-gray-400 line-through" : "flex-1"}>
                                {task.text}
                            </span>

                            <span className="text-sm text-gray-500">{formatTime(task.seconds)}</span>

                            {(task.status === "todo" || task.status ==="paused") && (
                                <button onClick={()=> changeStatus(task.id, "in-progress")} disabled={isBusy} className="rounded bg-blue-500 px-3 py-1 text-white disabled:opacity-40">
                                    {task.status=== "paused" ? "Resume" : "Start"}
                                </button>
                            )}
                            {task.status==="in-progress" && (
                                <>
                                <button onClick={()=> changeStatus(task.id, "paused")} className="rounded bg-yellow-500 px-3 py-1 text-white">
                                    Pause
                                </button>
                                <button onClick={()=> finishTask(task.id)} className="rounded bg-green-500 px-3 py-1 text-white">
                                    Done
                                </button>
                                </>
                            )}
                        </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
