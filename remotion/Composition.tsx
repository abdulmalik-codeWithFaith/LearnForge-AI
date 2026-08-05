import { AbsoluteFill, Sequence, Audio, useVideoConfig } from "remotion";

export type VideoStep = {
  title: string;
  code: string;
  audioUrl: string;
  durationInFrames: number;
};

export type LessonVideoProps = {
  lessonTitle: string;
  steps: VideoStep[];
};

export function LessonVideo({ lessonTitle, steps }: LessonVideoProps) {
  let startFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0e0e10" }}>
      {steps.map((step, i) => {
        const seq = (
          <Sequence
            key={i}
            from={startFrame}
            durationInFrames={step.durationInFrames}
          >
            <StepSlide step={step} index={i} total={steps.length} lessonTitle={lessonTitle} />
            <Audio src={step.audioUrl} />
          </Sequence>
        );
        startFrame += step.durationInFrames;
        return seq;
      })}
    </AbsoluteFill>
  );
}

function StepSlide({
  step,
  index,
  total,
  lessonTitle,
}: {
  step: VideoStep;
  index: number;
  total: number;
  lessonTitle: string;
}) {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        fontFamily: "monospace",
      }}
    >
      <div style={{ color: "#8a8a8f", fontSize: 18, marginBottom: 16 }}>
        {lessonTitle} — step {index + 1} of {total}
      </div>
      <div
        style={{
          color: "#f5c542",
          fontSize: 28,
          fontWeight: 600,
          marginBottom: 24,
        }}
      >
        {step.title}
      </div>
      <pre
        style={{
          backgroundColor: "#1a1a1d",
          color: "#e8e8ea",
          padding: 32,
          borderRadius: 12,
          fontSize: 22,
          lineHeight: 1.6,
          maxWidth: "80%",
          overflow: "hidden",
          whiteSpace: "pre-wrap",
        }}
      >
        {step.code}
      </pre>
    </AbsoluteFill>
  );
}