import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  assignedTo: string;
  createdAt: string;
}

let tasks: Task[] = []; // In-memory storage (Replace with DB later)

const SECRET_KEY = "your-secret-key"; // Use env variable in production

function verifyToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 };
  }
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, SECRET_KEY);
    return { error: null };
  } catch {
    return { error: "Invalid token", status: 403 };
  }
}

export async function GET() {
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  try {
    const authCheck = verifyToken(req.headers.get("authorization"));
    if (authCheck.error) {
      return NextResponse.json({ message: authCheck.error }, { status: authCheck.status });
    }

    const { title, description, assignedTo } = await req.json();
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      status: "pending",
      assignedTo,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    return NextResponse.json({ message: "Task created", task: newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating task", error }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const authCheck = verifyToken(req.headers.get("authorization"));
    if (authCheck.error) {
      return NextResponse.json({ message: authCheck.error }, { status: authCheck.status });
    }

    const { id, title, description, status, assignedTo } = await req.json();
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title || tasks[taskIndex].title,
      description: description || tasks[taskIndex].description,
      status: status || tasks[taskIndex].status,
      assignedTo: assignedTo || tasks[taskIndex].assignedTo,
    };

    return NextResponse.json({ message: "Task updated", task: tasks[taskIndex] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating task", error }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const authCheck = verifyToken(req.headers.get("authorization"));
    if (authCheck.error) {
      return NextResponse.json({ message: authCheck.error }, { status: authCheck.status });
    }

    const { id } = await req.json();
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    tasks.splice(taskIndex, 1);
    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting task", error }, { status: 400 });
  }
}
