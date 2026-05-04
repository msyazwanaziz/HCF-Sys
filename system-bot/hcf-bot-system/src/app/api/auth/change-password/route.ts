import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, currentPassword, newPassword } = await request.json();

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Since we are not using bcrypt in this mock setup (from login/register routes),
    // we compare the passwordHash directly. If using bcrypt, use bcrypt.compare here.
    if (user.passwordHash !== currentPassword) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
    }

    // Update password
    await prisma.user.update({
      where: { email },
      data: { passwordHash: newPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
