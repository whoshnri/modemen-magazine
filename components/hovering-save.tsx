import { Bookmark } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { LoginDialog } from "./LoginModal";
import { useState, useEffect } from "react";
import { isContentSavedByUser, saveArticle, saveIssue, unsaveArticle, unsaveIssue } from "@/app/actions/saver";

interface SaverProps {
  type: "article" | "issue";
  contentID: string;
}

export default function SaveModal({ type, contentID }: SaverProps) {
  const { session } = useSession();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveClick = async() => {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    } else {
      if (type === "article") {
        const result = await saveArticle(session.id, contentID);
        if (result) {
          setIsSaved(true);
        }else if(result === false){
          setIsSaved(false);
        }else{
          return
        }
      } else {
        const result = await saveIssue(session.id, contentID);
        if (result) {
          setIsSaved(true);
        }else if(result === false){
          setIsSaved(false);
        }else{
          return
        }
      }
    }
  };

 async function handleUnsaveClick() {
    if (!session) {
      setIsLoginDialogOpen(true);
      return;
    } else {
      if (type === "article") {
        const result = await unsaveArticle(session.id, contentID);
        if (result) {
          setIsSaved(false);
        }else if(result === false){
          setIsSaved(true);
        }else{
          return
        }
      } else {
        const result = await unsaveIssue(session.id, contentID);
        if (result) {
          setIsSaved(false);
        }else if(result === false){
          setIsSaved(true);
        }else{
          return
        }
      }
    }
  }

  // checker
  useEffect(() => {
    async function checkIfSaved() {
      if (!session) return;
      const result = await isContentSavedByUser(session.id, contentID, type);
      setIsSaved(result);
    }

    checkIfSaved();
  }, [session, contentID, type]);

  return (
    <>
      <div
        onClick={isSaved ? handleUnsaveClick : handleSaveClick}
        className={`p-5 border-border fixed bottom-10 z-50 right-5 border hover:bg-white/10 active:bg-white/20 bg-accent cursor-pointer transition grid place-items-center gap-2 uppercase text-sm font-bold  bg-black-primary ${isSaved ? "border-gold-primary text-gold-primary" : "text-muted-foreground"}`}
      >
        <Bookmark className={` w-10 h-10`}/>
        {isSaved ? "Saved" : "Save"}
      </div>
      <LoginDialog
        text="Login to your account to save articles you love!"
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        onSuccess={() => {
          handleSaveClick();
          setIsLoginDialogOpen(false)
        }}
      />
    </>
  );
}


