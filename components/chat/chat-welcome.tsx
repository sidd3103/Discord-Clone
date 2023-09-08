import { Hash } from "lucide-react";

const ChatWelcome = ({
  name,
  type,
}: {
  name: string;
  type: "channel" | "conversation";
}) => {
  return (
    <div className="space-y-2 px-4 mb-2">
      {type === "channel" && (
        <div className="h-[75px] w-[75px] rounded-full flex items-center justify-center bg-zinc-500 dark:bg-zinc-700">
          <Hash className="h-12 w-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {type === "channel" ? "Welcome to #" : ""}
        {name}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {type === "channel"
          ? `This is the start of #${name} channel`
          : `This is the start of the conversation with ${name}`}
      </p>
    </div>
  );
};

export default ChatWelcome;
