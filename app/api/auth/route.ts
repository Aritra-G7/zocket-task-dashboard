import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; // Ensure it's defined

// ✅ Handle GET request
export async function GET() {
  return NextResponse.json({ message: "Auth API is working!" }, { status: 200 });
}

// ✅ Handle POST request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Ensure JSON parsing
    console.log("Received request body:", body); // Log request body

    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    if (username === "admin" && password === "password") {
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
      return NextResponse.json({ token }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error("Error in /api/auth POST:", error); // Log full error
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
