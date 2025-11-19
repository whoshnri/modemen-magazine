import { Bookmark } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { LoginDialog } from "./LoginModal";
import { useState } from "react";

export default function SaveModal() {
  const { session } = useSession();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const handleSaveClick = () => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    }
  };

  return (
    <>
      <div
        onClick={handleSaveClick}
        className="p-5 border-border fixed bottom-10 z-50 right-5 border hover:bg-white/10 active:bg-white/20 bg-accent cursor-pointer transition grid place-items-center gap-2 uppercase text-sm font-bold text-muted-foreground bg-black-primary"
      >
        <Bookmark className="text-muted-foreground/70 w-10 h-10" />
        Save
      </div>
      <LoginDialog
        text="Login to your account to save articles you love!"
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        onSuccess={() => setIsLoginDialogOpen(false)}
      />
    </>
  );
}
