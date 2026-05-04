import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, role, bypassAuthorizedCheck } = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Check if email is authorized (optional but good for security)
    const settings = await prisma.systemSetting.findUnique({
      where: { id: "global" },
    });
    const authorizedMembers = (settings?.authorizedMembers as any[]) || [];
    const isAuthorized = authorizedMembers.some(m => m.email === email) || email.endsWith("@hcf.org.my");

    if (!isAuthorized && !bypassAuthorizedCheck) {
      return NextResponse.json({ error: "Email not authorized for registration" }, { status: 403 });
    }

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: password, // In production, use bcrypt.hash
        firstName,
        lastName,
        role: role || "USER",
      },
    });

    return NextResponse.json({
      user: {
        id: newUser.id,
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
