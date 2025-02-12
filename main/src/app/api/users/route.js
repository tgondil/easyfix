import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

// GET - Fetch all users
export async function GET() {
  await connectToDatabase();
  const users = await User.find();
  return NextResponse.json(users);
}

// POST - Create a new user
export async function POST(req) {
  await connectToDatabase();
  const { name, email } = await req.json();
  const newUser = await User.create({ name, email });
  return NextResponse.json(newUser, { status: 201 });
}
