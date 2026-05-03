import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Check for Global Admin (Hybrid Part 1: Master Key)
    const settings = await prisma.systemSetting.findUnique({
      where: { id: "global" },
    });

    const masterKey = settings?.masterKey || "hcf2026";

    if (email === "admin@hcf.org.my" && password === masterKey) {
      return NextResponse.json({
        user: {
          id: "admin",
          name: "System Administrator",
          email: "admin@hcf.org.my",
          role: "SUPER_ADMIN",
        },
      });
    }

    // 2. Check for Authorized Members (Hybrid Part 2: Staff via Master Key)
    const authorizedMembers = (settings?.authorizedMembers as any[]) || [];
    const authorizedMember = authorizedMembers.find((m) => m.email === email);

    if (authorizedMember && password === masterKey) {
      return NextResponse.json({
        user: {
          id: authorizedMember.id,
          name: authorizedMember.name,
          email: authorizedMember.email,
          role: authorizedMember.role,
        },
      });
    }

    // 3. Check for Registered Users (Hybrid Part 3: Individual Credentials)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Simple password check for now (should use bcrypt in production)
    if (user && user.passwordHash === password) {
      return NextResponse.json({
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
        },
      });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
