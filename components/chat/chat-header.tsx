import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { Hash, Menu, MenuSquare, Mic, Video } from "lucide-react";
import { redirect } from "next/navigation";
import { MobileToggle } from "../mobile-toggle";
import { IM_Fell_French_Canon } from "next/font/google";
import UserAvatar from "../user-avatar";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUri?: string;
}

const channelIconMap = {
  [ChannelType.TEXT]: (
    <Hash className="w-5 h-5 mx-2 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.AUDIO]: (
    <Mic className="w-5 h-5 mx-2 text-zinc-500 dark:text-zinc-400" />
  ),
  [ChannelType.VIDEO]: (
    <Video className="w-5 h-5 mx-2 text-zinc-500 dark:text-zinc-400" />
  ),
};

const ChatHeader = async ({
  serverId,
  name,
  type,
  imageUri,
}: ChatHeaderProps) => {
  const channel =
    type === "channel"
      ? await db.channel.findFirst({
          where: {
            serverId: serverId,
            name: name,
          },
        })
      : null;

  if (!channel && type === "channel") return redirect("/");

  const icon =
    type === "channel" ? (
      channelIconMap[channel!.type]
    ) : (
      <UserAvatar src={imageUri} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
    );

  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {icon}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
    </div>
  );
};

export default ChatHeader;
