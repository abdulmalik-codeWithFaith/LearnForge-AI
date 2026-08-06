import { AbsoluteFill, Sequence, Audio, useCurrentFrame, useVideoConfig, interpolate } from "remotion";


export type VideoStep = {
  title: string;
  code: string;
  explanation: string;
  audioUrl: string;
  durationInFrames: number;
};



export type LessonVideoProps = {
  lessonTitle: string;
  steps: VideoStep[];
  narrationUrl: string;
};

export function LessonVideo({ lessonTitle, steps, narrationUrl }: LessonVideoProps) {
  let startFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0e0e10" }}>
      <Audio src={narrationUrl} />
      {steps.map((step, i) => {
        const seq = (
          <Sequence key={i} from={startFrame} durationInFrames={step.durationInFrames}>
            <StepSlide step={step} index={i} total={steps.length} lessonTitle={lessonTitle} />
          </Sequence>
        );
        startFrame += step.durationInFrames;
        return seq;
      })}
    </AbsoluteFill>
  );
}


// ... keep LessonVideo exactly as it is above this ...

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
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = step.code.split("\n");
  const revealDurationFrames = fps * 1.5; // all lines finish appearing within first 1.5s
  const perLineDelay = lines.length > 1 ? revealDurationFrames / lines.length : 0;

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
      <div
        style={{
          backgroundColor: "#1a1a1d",
          color: "#e8e8ea",
          padding: 32,
          borderRadius: 12,
          fontSize: 22,
          lineHeight: 1.7,
          maxWidth: "80%",
        }}
      >
        {lines.map((line, i) => {
          const lineStartFrame = i * perLineDelay;
          const opacity = interpolate(
            frame,
            [lineStartFrame, lineStartFrame + fps * 0.3],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const translateY = interpolate(
            frame,
            [lineStartFrame, lineStartFrame + fps * 0.3],
            [8, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                whiteSpace: "pre",
              }}
            >
              {line || "\u00A0"}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 60,
          right: 60,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            backgroundColor: "rgba(0,0,0,0.75)",
            color: "#ffffff",
            fontSize: 20,
            lineHeight: 1.5,
            padding: "10px 20px",
            borderRadius: 8,
            maxWidth: "90%",
            fontFamily: "sans-serif",
          }}
        >
          {step.explanation}
        </div>
      </div>
    </AbsoluteFill>
  );
}