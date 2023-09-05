import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { v4 } from "uuid";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { name, imageUri } = await req.json();
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const server = await db.server.create({
      data: {
        name,
        imageUri,
        profileId: profile.id,
        inviteCode: v4(),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ role: MemberRole.ADMIN, profileId: profile.id }],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("Servers POST", error);
    return new NextResponse("Error", { status: 500 });
  }
}
