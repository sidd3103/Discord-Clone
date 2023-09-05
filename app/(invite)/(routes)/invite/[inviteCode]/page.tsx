import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";

const InviteCodePage = async ({
  params,
}: {
  params: { inviteCode: string };
}) => {
    
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();
  if (!params.inviteCode) return redirect("/");

  const currentServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (currentServer) return redirect(`/servers/${currentServer.id}`);

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) return redirect(`/servers/${server.id}`);

  return null;
};

export default InviteCodePage;
