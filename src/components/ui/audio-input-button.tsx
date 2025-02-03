import { Mic, Loader2 } from "lucide-react";
import { useAudioTranscription } from "@/hooks/useAudioTranscription";
import { AudioBars } from "./audio-bars";

interface AudioInputButtonProps {
  onTranscriptionComplete: (text: string) => void;
  onTranscriptionStart?: () => void;
  isLoading?: boolean;
  className?: string;
  silenceThreshold?: number;
}

export function AudioInputButton({
  onTranscriptionComplete,
  onTranscriptionStart,
  isLoading = false,
  className = "",
  silenceThreshold = 1000,
}: AudioInputButtonProps) {
  const { isRecording, frequencies, isSilent, startRecording, stopRecording } =
    useAudioTranscription({
      onTranscriptionComplete: (text) => {
        onTranscriptionComplete(text);
      },
      onTranscriptionStart: () => {
        onTranscriptionStart?.();
      },
      onError: (error) => {
        console.error("Audio transcription error:", error);
        onTranscriptionComplete(""); // This will trigger the error UI in ChatInput
      },
      silenceThreshold,
      minRecordingDuration: 500, // Ensure we get at least 0.5s of audio
    });

  return (
    <div className="relative">
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={className}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isRecording ? (
          <AudioBars
            frequencies={frequencies}
            color="black"
            isSilent={isSilent}
          />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
