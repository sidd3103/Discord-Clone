import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { v4 } from "uuid";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!params.serverId)
      return new NextResponse("Missing server id", { status: 400 });

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: v4(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("Servers ID", error);
    return new NextResponse("Error", { status: 500 });
  }
}
