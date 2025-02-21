const API_BASE_URL = "http://localhost:3000"; // ✅ No trailing slash

export const getTasks = async () => {  
    const response = await fetch(`${API_BASE_URL}/api/tasks`);
    if (!response.ok) {
        throw new Error(`Error fetching tasks: ${response.statusText}`);
    }
    return response.json();
};

export const createTask = async (taskData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
    });

    if (!response.ok) {
        throw new Error(`Error creating task: ${response.statusText}`);
    }

    return response.json();
};
