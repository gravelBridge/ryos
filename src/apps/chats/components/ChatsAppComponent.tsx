import { useState } from "react";
import { AppProps } from "../../base/types";
import { WindowFrame } from "@/components/layout/WindowFrame";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatsMenuBar } from "./ChatsMenuBar";
import { HelpDialog } from "@/components/dialogs/HelpDialog";
import { AboutDialog } from "@/components/dialogs/AboutDialog";
import { helpItems, appMetadata } from "..";
import { useChat } from "ai/react";
import { ArrowUp, Loader2, Square } from "lucide-react";

export function ChatsAppComponent({
  isWindowOpen,
  onClose,
  isForeground,
}: AppProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat();
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);

  if (!isWindowOpen) return null;

  return (
    <>
      <ChatsMenuBar
        onClose={onClose}
        onShowHelp={() => setIsHelpDialogOpen(true)}
        onShowAbout={() => setIsAboutDialogOpen(true)}
      />
      <WindowFrame
        title="Chats"
        onClose={onClose}
        isForeground={isForeground}
        appId="chats"
        windowConstraints={{
          minWidth: 260,
          minHeight: 400,
          maxWidth: 260,
          maxHeight: 800,
        }}
      >
        <div className="flex flex-col h-full bg-[#c0c0c0] p-2 w-full max-w-full">
          <ScrollArea className="flex-1 bg-white border-2 border-gray-800 rounded mb-2 p-2 h-full w-full">
            <div className="flex flex-col gap-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div className="text-[16px] text-gray-500 mb-0.5 font-['Geneva-9']">
                    {message.role === "user" ? "You" : "Ryo"}{" "}
                    <span className="text-gray-400">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div
                    className={`max-w-[90%] p-1.5 px-2 rounded leading-snug text-xs font-['Geneva-12'] antialiased ${
                      message.role === "user"
                        ? "bg-yellow-200 text-black"
                        : "bg-blue-200 text-black"
                    }`}
                  >
                    <div className="break-words">{message.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-gray-500 font-['Geneva-12']">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Thinking...
                </div>
              )}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 border-2 border-gray-800 text-xs font-['Geneva-12'] antialiased h-8"
              disabled={isLoading}
            />
            {isLoading ? (
              <Button
                type="button"
                onClick={() => stop()}
                className="bg-black hover:bg-black/80 text-white text-xs border-2 border-gray-800 w-8 h-8 p-0 flex items-center justify-center"
              >
                <Square className="h-4 w-4" fill="currentColor" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-black hover:bg-black/80 text-white text-xs border-2 border-gray-800 w-8 h-8 p-0 flex items-center justify-center"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            )}
          </form>
        </div>
        <HelpDialog
          isOpen={isHelpDialogOpen}
          onOpenChange={setIsHelpDialogOpen}
          helpItems={helpItems}
          appName="Chats"
        />
        <AboutDialog
          isOpen={isAboutDialogOpen}
          onOpenChange={setIsAboutDialogOpen}
          metadata={appMetadata}
        />
      </WindowFrame>
    </>
  );
}
