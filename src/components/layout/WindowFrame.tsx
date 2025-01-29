import { useWindowManager } from "@/hooks/useWindowManager";
import { ResizeType } from "@/types/types";
import { APP_STORAGE_KEYS } from "@/utils/storage";

interface WindowFrameProps {
  children: React.ReactNode;
  title: string;
  onClose?: () => void;
  isForeground?: boolean;
  appId: keyof typeof APP_STORAGE_KEYS;
}

export function WindowFrame({
  children,
  title,
  onClose,
  isForeground = true,
  appId,
}: WindowFrameProps) {
  const {
    windowPosition,
    windowSize,
    isDragging,
    resizeType,
    handleMouseDown,
    handleResizeStart,
  } = useWindowManager({ appId });

  return (
    <div
      className="md:absolute md:min-w-[800px] md:min-h-[400px] p-2 md:p-0 w-full h-full max-w-[100vw] max-h-[100vh] mt-6 md:mt-0 select-none"
      style={{
        left: windowPosition.x,
        top: Math.max(30, windowPosition.y),
        width: window.innerWidth >= 768 ? windowSize.width : "100%",
        height: window.innerWidth >= 768 ? windowSize.height : "auto",
        transition: isDragging || resizeType ? "none" : "all 0.2s ease",
      }}
    >
      <div className="relative h-full bg-system7-window-bg border-[2px] border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Resize handles */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-0 right-0 h-2 cursor-n-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeStart(e, "n" as ResizeType)}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-2 cursor-s-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeStart(e, "s" as ResizeType)}
          />
          <div
            className="absolute left-0 top-0 bottom-0 w-2 cursor-w-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeStart(e, "w" as ResizeType)}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeStart(e, "e" as ResizeType)}
          />
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeStart(e, "ne" as ResizeType)}
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeStart(e, "sw" as ResizeType)}
          />
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeStart(e, "se" as ResizeType)}
          />
        </div>

        {/* Title bar */}
        <div
          className={`flex items-center flex-none h-6 mx-0 my-[0.1rem] px-[0.1rem] py-[0.2rem] ${
            isForeground
              ? "bg-[linear-gradient(#000_50%,transparent_0)] bg-clip-content bg-[length:6.6666666667%_13.3333333333%]"
              : "bg-white"
          } cursor-move border-b-[2px] border-black`}
          onMouseDown={handleMouseDown}
        >
          <button
            onClick={onClose}
            className="ml-2 w-4 h-4 bg-white border-2 border-black hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center shadow-[0_0_0_1px_white]"
          />
          <span className="select-none mx-auto bg-white px-2 py-0 h-full flex items-center justify-center">
            {title}
          </span>
          <div className="mr-2 w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex flex-1 md:h-full h-auto flex-col md:flex-row">
          {children}
        </div>
      </div>
    </div>
  );
}
