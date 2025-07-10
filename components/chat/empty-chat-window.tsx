import Image from "next/image";

export const EmptyChatWindow = () => {
  return (
    <div className="flex items-center justify-center h-full w-full pointer-events-none">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        {/* Logo */}
        <Image src="/app_logo_transparent.png" alt="Logo" height={303} width={254} className="opactiy-70 w-32" />

        {/* Text below logo */}
        <p className="text-sm italic">Select a chat to start messaging</p>
      </div>
    </div>
  );
};
