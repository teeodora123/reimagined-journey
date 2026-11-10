import {STATUS } from "../constants";

function formatTime(seconds){
    const minutes = Math.floor(seconds/60);
    const secs = seconds % 60;
    return `${minutes}:${String(secs).padStart(2,"0")}`;
}

function TaskItem({task, isBusy, changeStatus, finishTask}) {
    return (
        <li className="flex items-center gap-2 rounded border bg-white p-3">
            <span className={task.status===STATUS.DONE ? "flex-1 text-gray-400 line-through" : "flex-1"}>
                {task.text}
            </span>

            <span className="text-sm text-gray-500">{formatTime(task.seconds)}</span>

            {(task.status === STATUS.TODO || task.status===STATUS.PAUSED) && (
                <button onClick={()=> changeStatus(task.id, STATUS.IN_PROGRESS)} disabled={isBusy} className="rounded bg-blue-500 px-3 py-1 text-white disabled:opacity-40">
                    {task.status===STATUS.PAUSED ? "Resume" : "Start"}
                </button>
            )}
            {task.status===STATUS.IN_PROGRESS && (
                <>
                    <button onClick={()=> changeStatus(task.id, STATUS.PAUSED)} className="rounded bg-yellow-500 px-3 py-1 text-white">
                        Pause
                    </button>
                    <button onClick={()=> finishTask(task.id)} className="rounded bg-green-500 px-3 py-1 text-white">
                        Done
                    </button>
                </>
            )}
        </li>
    );
}

export default TaskItem;