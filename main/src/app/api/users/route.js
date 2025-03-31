import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export async function GET() {
  await connectToDatabase();
  const users = await User.find();
  return NextResponse.json(users);
}

export async function POST(req) {
  await connectToDatabase();

  const body = await req.json();
  const parsed = userSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email } = parsed.data;
  const newUser = await User.create({ name, email });

  return NextResponse.json(newUser, { status: 201 });
}
