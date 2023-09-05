import { redirect } from "next/navigation";
import { initialProfile } from "@/lib/intial-profile";
import { db } from "@/lib/db";
import {InitialModal} from "@/components/modals/initial-modal";

const SetupPage = async () => {
  const profile = await initialProfile();
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) return <InitialModal/>

  return redirect(`/servers/${server.id}`);
};

export default SetupPage;
