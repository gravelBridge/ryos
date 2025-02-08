import React, { useState, useRef, useEffect } from "react";
import { PaintToolbar } from "./PaintToolbar";
import { PaintCanvas } from "./PaintCanvas";
import { PaintMenuBar } from "./PaintMenuBar";
import { PaintPatternPalette } from "./PaintPatternPalette";
import { PaintStrokeSettings } from "./PaintStrokeSettings";
import { WindowFrame } from "@/components/layout/WindowFrame";
import { AppProps } from "../../base/types";
import { HelpDialog } from "@/components/dialogs/HelpDialog";
import { AboutDialog } from "@/components/dialogs/AboutDialog";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";
import { InputDialog } from "@/components/dialogs/InputDialog";
import { helpItems, appMetadata } from "..";
import { useFileSystem } from "@/apps/finder/hooks/useFileSystem";
import { useLaunchApp } from "@/hooks/useLaunchApp";
import { APP_STORAGE_KEYS } from "@/utils/storage";

export const PaintAppComponent: React.FC<AppProps> = ({
  isWindowOpen,
  onClose,
  isForeground = false,
}) => {
  const [selectedTool, setSelectedTool] = useState<string>("pencil");
  const [selectedPattern, setSelectedPattern] = useState<string>("pattern-1");
  const [strokeWidth, setStrokeWidth] = useState<number>(1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  const [isConfirmNewDialogOpen, setIsConfirmNewDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [saveFileName, setSaveFileName] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const canvasRef = useRef<{
    undo: () => void;
    redo: () => void;
    clear: () => void;
    exportCanvas: () => string;
    importImage: (dataUrl: string) => void;
  }>();
  const { files } = useFileSystem("/Images");
  const launchApp = useLaunchApp();

  // Initial load - try to restore last opened image
  useEffect(() => {
    if (canvasRef.current) {
      const lastFilePath = localStorage.getItem(
        APP_STORAGE_KEYS.paint.LAST_FILE_PATH
      );

      if (lastFilePath?.startsWith("/Images/")) {
        const file = files.find((f) => f.path === lastFilePath);
        if (file?.content && !currentFilePath) {
          setIsLoadingFile(true);
          canvasRef.current.importImage(file.content);
          setCurrentFilePath(lastFilePath);
          setHasUnsavedChanges(false);
          setIsLoadingFile(false);
        }
      }
    }
  }, [files, currentFilePath]);

  // Check for pending file open when window becomes active
  useEffect(() => {
    if (isForeground && canvasRef.current) {
      const pendingFileOpen = localStorage.getItem("pending_file_open");
      if (pendingFileOpen) {
        try {
          const { path, content } = JSON.parse(pendingFileOpen);
          if (path.startsWith("/Images/")) {
            if (hasUnsavedChanges && currentFilePath) {
              setIsConfirmNewDialogOpen(true);
            } else {
              handleFileOpen(path, content);
            }
          }
        } catch (e) {
          console.error("Failed to parse pending file open data:", e);
          localStorage.removeItem("pending_file_open");
        }
      }
    }
  }, [isForeground, hasUnsavedChanges, currentFilePath]);

  const handleFileOpen = (path: string, content: string) => {
    setIsLoadingFile(true);
    canvasRef.current?.importImage(content);
    setCurrentFilePath(path);
    setHasUnsavedChanges(false);
    localStorage.setItem(APP_STORAGE_KEYS.paint.LAST_FILE_PATH, path);
    setIsLoadingFile(false);
    localStorage.removeItem("pending_file_open");
  };

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  const handleRedo = () => {
    canvasRef.current?.redo();
  };

  const handleClear = () => {
    canvasRef.current?.clear();
    localStorage.removeItem(APP_STORAGE_KEYS.paint.LAST_FILE_PATH);
  };

  const handleNewFile = () => {
    if (hasUnsavedChanges && currentFilePath) {
      setIsConfirmNewDialogOpen(true);
      return;
    }
    handleClear();
    setCurrentFilePath(null);
    setHasUnsavedChanges(false);
  };

  const handleSave = () => {
    if (!canvasRef.current) return;

    if (!currentFilePath) {
      setIsSaveDialogOpen(true);
      setSaveFileName("untitled.png");
    } else {
      const content = canvasRef.current.exportCanvas();
      const fileName = currentFilePath.split("/").pop() || "untitled.png";

      // Dispatch saveFile event
      const saveEvent = new CustomEvent("saveFile", {
        detail: {
          name: fileName,
          path: currentFilePath,
          content: content,
          icon: "/icons/image.png",
          isDirectory: false,
        },
      });
      window.dispatchEvent(saveEvent);

      localStorage.setItem(
        APP_STORAGE_KEYS.paint.LAST_FILE_PATH,
        currentFilePath
      );
      setHasUnsavedChanges(false);
    }
  };

  const handleSaveSubmit = (fileName: string) => {
    if (!canvasRef.current) return;

    const content = canvasRef.current.exportCanvas();
    const filePath = `/Images/${fileName}${
      fileName.endsWith(".png") ? "" : ".png"
    }`;

    // Dispatch saveFile event
    const saveEvent = new CustomEvent("saveFile", {
      detail: {
        name: fileName,
        path: filePath,
        content: content,
        icon: "/icons/image.png",
        isDirectory: false,
      },
    });
    window.dispatchEvent(saveEvent);

    localStorage.setItem(APP_STORAGE_KEYS.paint.LAST_FILE_PATH, filePath);
    setCurrentFilePath(filePath);
    setHasUnsavedChanges(false);
    setIsSaveDialogOpen(false);
  };

  const handleImportFile = () => {
    launchApp("finder", { initialPath: "/Images" });
  };

  const handleExportFile = () => {
    handleSave();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        canvasRef.current?.importImage(dataUrl);
        setCurrentFilePath(file.name);
        setHasUnsavedChanges(false);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isWindowOpen) return null;

  return (
    <>
      <PaintMenuBar
        isWindowOpen={isWindowOpen}
        isForeground={isForeground}
        onClose={onClose}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onShowHelp={() => setIsHelpDialogOpen(true)}
        onShowAbout={() => setIsAboutDialogOpen(true)}
        onNewFile={handleNewFile}
        onSave={handleSave}
        onImportFile={handleImportFile}
        onExportFile={handleExportFile}
        hasUnsavedChanges={hasUnsavedChanges}
        currentFilePath={currentFilePath}
        handleFileSelect={handleFileSelect}
      />
      <WindowFrame
        title={
          currentFilePath
            ? currentFilePath.split("/").pop() || "Untitled"
            : `Untitled${hasUnsavedChanges ? " •" : ""}`
        }
        onClose={onClose}
        isForeground={isForeground}
        appId="paint"
      >
        <div
          className="flex flex-col h-full w-full min-h-0 p-2"
          style={{
            backgroundImage: 'url("/patterns/Property 1=7.svg")',
            backgroundRepeat: "repeat",
            backgroundColor: "#c0c0c0",
          }}
        >
          <div className="flex flex-1 gap-2 w-full min-h-0 px-1">
            {/* Left Toolbar */}
            <div className="flex flex-col gap-2 w-[84px] shrink-0">
              {/* Tools */}
              <div className="bg-white border border-black w-full shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                <PaintToolbar
                  selectedTool={selectedTool}
                  onToolSelect={setSelectedTool}
                />
              </div>
              {/* Stroke Width */}
              <div className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                <PaintStrokeSettings
                  strokeWidth={strokeWidth}
                  onStrokeWidthChange={setStrokeWidth}
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 gap-2 min-h-0 min-w-0">
              {/* Canvas */}
              <div className="flex-1 bg-white min-h-0 min-w-0 border border-black border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                <PaintCanvas
                  ref={(ref) => {
                    if (ref) {
                      canvasRef.current = {
                        undo: ref.undo,
                        redo: ref.redo,
                        clear: ref.clear,
                        exportCanvas: ref.exportCanvas,
                        importImage: ref.importImage,
                      };
                    }
                  }}
                  selectedTool={selectedTool}
                  selectedPattern={selectedPattern}
                  strokeWidth={strokeWidth}
                  onCanUndoChange={setCanUndo}
                  onCanRedoChange={setCanRedo}
                  onContentChange={() => {
                    if (!isLoadingFile) {
                      setHasUnsavedChanges(true);
                    }
                  }}
                />
              </div>

              {/* Pattern Area */}
              <div className="h-[58px] bg-white border-black flex items-center border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                {/* Selected Pattern Preview */}
                <div className="border-r border-black h-full px-3 flex items-center">
                  <div className="w-[36px] h-[32px] border border-black shrink-0">
                    <img
                      src={`/patterns/Property 1=${
                        selectedPattern.split("-")[1]
                      }.svg`}
                      alt="Selected Pattern"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Pattern Palette */}
                <div className="flex-1 h-full min-w-0 translate-y-[-1px]">
                  <PaintPatternPalette
                    selectedPattern={selectedPattern}
                    onPatternSelect={setSelectedPattern}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </WindowFrame>
      <InputDialog
        isOpen={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        onSubmit={handleSaveSubmit}
        title="Save Image"
        description="Enter a name for your image"
        value={saveFileName}
        onChange={setSaveFileName}
      />
      <HelpDialog
        isOpen={isHelpDialogOpen}
        onOpenChange={setIsHelpDialogOpen}
        helpItems={helpItems}
        appName="MacPaint"
      />
      <AboutDialog
        isOpen={isAboutDialogOpen}
        onOpenChange={setIsAboutDialogOpen}
        metadata={appMetadata}
      />
      <ConfirmDialog
        isOpen={isConfirmNewDialogOpen}
        onOpenChange={setIsConfirmNewDialogOpen}
        onConfirm={() => {
          handleClear();
          setCurrentFilePath(null);
          setHasUnsavedChanges(false);
          setIsConfirmNewDialogOpen(false);
          localStorage.removeItem(APP_STORAGE_KEYS.paint.LAST_FILE_PATH);

          // Check if there's a pending file to open after creating new file
          const pendingFileOpen = localStorage.getItem("pending_file_open");
          if (pendingFileOpen) {
            try {
              const { path, content } = JSON.parse(pendingFileOpen);
              if (path.startsWith("/Images/")) {
                handleFileOpen(path, content);
              }
            } catch (e) {
              console.error("Failed to parse pending file open data:", e);
              localStorage.removeItem("pending_file_open");
            }
          }
        }}
        title="Discard Changes"
        description="You have unsaved changes. Create new file anyway?"
      />
    </>
  );
};
