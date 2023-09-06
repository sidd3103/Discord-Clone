import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";

const iconMap = {
  [ChannelType.AUDIO]: <Mic className="h-4 w-4 mr-2" />,
  [ChannelType.TEXT]: <Hash className="h-4 w-4 mr-2" />,
  [ChannelType.VIDEO]: <Video className="h-4 w-4 mr-2" />,
};

const roleIcons = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

const ServerSidebar = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) return redirect("/");

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = server.members.filter(
    (member) => member.profileId !== profile.id
  );

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full w-full text-primary dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((c) => ({
                  id: c.id,
                  name: c.name,
                  icon: iconMap[c.type],
                })),
              },
              {
                label: "Audio Channels",
                type: "channel",
                data: audioChannels?.map((c) => ({
                  id: c.id,
                  name: c.name,
                  icon: iconMap[c.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((c) => ({
                  id: c.id,
                  name: c.name,
                  icon: iconMap[c.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((m) => ({
                  id: m.id,
                  name: m.profile.name,
                  icon: roleIcons[m.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              server={server}
              label="Text Channels"
              role={role}
            />
            <div className="space-y-[2px]">
              {textChannels.map((c) => (
                <ServerChannel
                  key={c.id}
                  channel={c}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              server={server}
              label="Audio Channels"
              role={role}
            />
            <div className="space-y-[2px]">
              {audioChannels.map((c) => (
                <ServerChannel
                  key={c.id}
                  channel={c}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              server={server}
              label="Video Channels"
              role={role}
            />
            <div className="space-y-[2px]">
              {videoChannels.map((c) => (
                <ServerChannel
                  key={c.id}
                  channel={c}
                  server={server}
                  role={role}
                />
              ))}
            </div>
          </div>
        )}
        {members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              server={server}
              label="Members"
              role={role}
            />
            <div className="space-y-[2px]">
              {members.map((m) => (
                <ServerMember key={m.profile.id} member={m} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
