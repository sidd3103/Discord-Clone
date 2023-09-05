"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ActionTooltip from "../action-tooltip";

interface NavigationItemProps {
  id: string;
  imageUri: string;
  name: string;
}

const NavigationItem = ({ id, imageUri, name }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        className="group relative flex items-center"
        onClick={() => router.push(`/servers/${id}`)}
        type="button"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-1",
            params?.serverId !== id && "group-hover:h-5",
            params?.serverId === id ? "h-9" : "h-2"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-12 w-12 rounded-3xl group-hover:rounded-3xl transition-all overflow-hidden",
            params?.serverId === id && "bg-primary/10 text-primary rounded-2xl"
          )}
        >
          <Image fill src={imageUri} alt="Channel" />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
