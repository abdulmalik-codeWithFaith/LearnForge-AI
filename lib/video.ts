import path from "path";
import os from "os";
import fs from "fs";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { generateNarrationAudio } from "./tts";
import { uploadFile, getSignedFileUrl } from "./storage";
import type { VideoStep } from "../remotion/Composition";
import { generateCombinedNarration } from "./tts";

const FPS = 30;
const PADDING_SECONDS = 1; // brief pause after each step's narration ends

export async function renderLessonVideo({
  lessonSlug,
  lessonTitle,
  steps,
}: {
  lessonSlug: string;
  lessonTitle: string;
  steps: Array<{ title: string; code: string; explanation: string }>;
}): Promise<{ videoKey: string; totalDurationSeconds: number }> {
  // 1. One combined TTS call for the whole lesson
  const { audio, totalDurationSeconds } = await generateCombinedNarration(
    steps.map((s) => s.explanation)
  );

  const audioKey = `lessons/${lessonSlug}/audio/narration.wav`;
  await uploadFile(audioKey, audio, "audio/wav");
  const audioUrl = await getSignedFileUrl(audioKey, 3600);

  // 2. Split total duration proportionally by each step's explanation length
  const totalChars = steps.reduce((sum, s) => sum + s.explanation.length, 0);
  const videoSteps: VideoStep[] = steps.map((step) => {
    const share = step.explanation.length / totalChars;
    const durationInFrames = Math.max(
      FPS * 2, // minimum 2 seconds per step
      Math.ceil(totalDurationSeconds * share * FPS)
    );
    return {
      title: step.title,
      code: step.code,
      explanation: step.explanation,
      audioUrl: "", // no longer per-step
      durationInFrames,
    };
  });

  // 3. Bundle + render (audio now plays once for the whole video, not per-step)
  const bundleLocation = await bundle({
    entryPoint: path.join(process.cwd(), "remotion", "index.ts"),
  });

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "LessonVideo",
    inputProps: { lessonTitle, steps: videoSteps, narrationUrl: audioUrl },
  });

  const outputPath = path.join(os.tmpdir(), `${lessonSlug}-${Date.now()}.mp4`);

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: { lessonTitle, steps: videoSteps, narrationUrl: audioUrl },
  });

  const videoBuffer = fs.readFileSync(outputPath);
  const videoKey = `lessons/${lessonSlug}/video.mp4`;
  await uploadFile(videoKey, videoBuffer, "video/mp4");
  fs.unlinkSync(outputPath);

  return { videoKey, totalDurationSeconds: Math.round(totalDurationSeconds) };
}