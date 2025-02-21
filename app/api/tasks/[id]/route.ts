import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  assignedTo: string;
  createdAt: string;
}

let tasks: Task[] = []; // Temporary in-memory storage

const SECRET_KEY = "your-secret-key"; // Store in .env in production

// ✅ PUT - Update a task
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    try {
        jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    const updatedData = await req.json();
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
        return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedData };
    return NextResponse.json({ message: "Task updated", task: tasks[taskIndex] });
}

// ✅ DELETE - Remove a task
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    try {
        jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    tasks = tasks.filter((task) => task.id !== id);
    return NextResponse.json({ message: "Task deleted successfully" });
}
