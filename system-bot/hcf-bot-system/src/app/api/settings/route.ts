import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    let settings = await prisma.systemSetting.findUnique({
      where: { id: "global" },
    });

    if (!settings) {
      settings = await prisma.systemSetting.create({
        data: {
          id: "global",
          theme: "system",
          masterKey: "hcf2026",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch settings from DB", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // We update the existing global record
    const settings = await prisma.systemSetting.upsert({
      where: { id: "global" },
      update: data,
      create: {
        id: "global",
        ...data
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to update settings in DB", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
