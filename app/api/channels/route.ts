import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { v4 } from "uuid";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!serverId)
      return new NextResponse("Missing server ID", { status: 400 });
    if (name === "general")
      return new NextResponse("Name cannot be 'general'", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            name,
            type,
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("Servers POST", error);
    return new NextResponse("Error", { status: 500 });
  }
}
