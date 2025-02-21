import { useEffect, useState } from "react";
import { getTasks } from "@/utils/api";  // ✅ Correct absolute import

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
};

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await getTasks();  
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Task List</h2>
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id} className="border p-2 mb-2 rounded">
              <h3 className="font-semibold">{task.title}</h3>
              <p>{task.description}</p>
              <span className="text-sm text-gray-500">Status: {task.status}</span>
            </li>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </ul>
    </div>
  );
};

export default TaskList;
