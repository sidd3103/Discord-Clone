import { currentProfile } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const profile = await currentProfile(req);
    const { content, fileUrl } = req.body;
    const { channelId, serverId } = req.query;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });
    if (!serverId) return res.status(400).json({ error: "Server id missing" });
    if (!channelId)
      return res.status(400).json({ error: "Channel id missing" });
    if (!content) return res.status(400).json({ error: "Content missing" });

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: { members: true },
    });

    if (!server) return res.status(404).json({ error: "Server not found" });

    const channel = await db.channel.findFirst({
      where: {
        serverId: serverId as string,
        id: channelId as string,
      },
    });

    if (!channel) return res.status(404).json({ error: "Channel not found" });

    const member = server.members.find((m) => m.profileId === profile.id);

    if (!member) return res.status(404).json({ error: "Member not found" });

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        memberId: member.id,
        channelId: channelId as string,
      },
      include: {
        member: { include: { profile: true } },
      },
    });

    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.log("Messages POST", error);
    return res.status(500);
  }
}
