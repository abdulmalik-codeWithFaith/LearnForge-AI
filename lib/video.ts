import path from "path";
import os from "os";
import fs from "fs";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { generateNarrationAudio } from "./tts";
import { uploadFile, getSignedFileUrl } from "./storage";
import type { VideoStep } from "../remotion/Composition";

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
  // 1. Generate narration audio for each step, upload each to storage
  const videoSteps: VideoStep[] = [];
  let totalDurationSeconds = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const { audio, durationSeconds } = await generateNarrationAudio(
      step.explanation
    );

    const audioKey = `lessons/${lessonSlug}/audio/step-${i + 1}.wav`;
    await uploadFile(audioKey, audio, "audio/wav");
    const audioUrl = await getSignedFileUrl(audioKey, 3600); // 1hr, long enough for render

    const paddedSeconds = durationSeconds + PADDING_SECONDS;
    videoSteps.push({
      title: step.title,
      code: step.code,
      audioUrl,
      durationInFrames: Math.ceil(paddedSeconds * FPS),
    });
    totalDurationSeconds += paddedSeconds;
  }

  // 2. Bundle the Remotion project
  const bundleLocation = await bundle({
    entryPoint: path.join(process.cwd(), "remotion", "index.ts"),
  });

  // 3. Resolve composition + calculate real duration from our steps
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "LessonVideo",
    inputProps: { lessonTitle, steps: videoSteps },
  });

  // 4. Render to a temp local file
  const outputPath = path.join(os.tmpdir(), `${lessonSlug}-${Date.now()}.mp4`);

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: { lessonTitle, steps: videoSteps },
  });

  // 5. Upload the rendered video to storage
  const videoBuffer = fs.readFileSync(outputPath);
  const videoKey = `lessons/${lessonSlug}/video.mp4`;
  await uploadFile(videoKey, videoBuffer, "video/mp4");

  // 6. Clean up local temp file
  fs.unlinkSync(outputPath);

  return { videoKey, totalDurationSeconds: Math.round(totalDurationSeconds) };
}