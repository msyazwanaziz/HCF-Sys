import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status:400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the user from the database
    // Note: This might fail if there are foreign key constraints (attendances, etc.)
    // In a real app, we might want to do a soft delete or handle relations.
    try {
      await prisma.user.delete({
        where: { email },
      });
    } catch (e: any) {
      // If deletion fails due to constraints, we'll just log it and return error
      console.error("Deletion failed:", e);
      return NextResponse.json({ 
        error: "Cannot delete user with active records. Please remove their related data first.",
        details: e.message 
      }, { status: 400 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("User deletion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
