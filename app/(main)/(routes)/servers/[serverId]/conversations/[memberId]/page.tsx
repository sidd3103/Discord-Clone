import ChatHeader from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: { profile: true },
  });

  if (!currentMember) return redirect("/");

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );
  if (!conversation) return redirect(`/servers/${params.serverId}`);
  const { memberOne, memberTwo } = conversation;
  const otherMember =
    profile.id === memberOne.profileId ? memberTwo : memberOne;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#313338]">
      <ChatHeader
        type="conversation"
        name={otherMember.profile.name}
        imageUri={otherMember.profile.imageUri}
        serverId={params.serverId}
      />
      {/* Hello world!!! */}
    </div>
  );
};

export default MemberIdPage;