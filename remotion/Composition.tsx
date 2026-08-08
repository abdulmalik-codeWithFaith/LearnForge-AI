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
  const revealDurationFrames = fps * 1.5;
  const perLineDelay = lines.length > 1 ? revealDurationFrames / lines.length : 0;

  return (
    <AbsoluteFill
      style={{
        flexDirection: "column",
        fontFamily: "monospace",
      }}
    >
      {/* Header */}
      <div style={{ padding: "40px 60px 0 60px" }}>
        <div style={{ color: "#8a8a8f", fontSize: 18, marginBottom: 12 }}>
          {lessonTitle} — step {index + 1} of {total}
        </div>
        <div
          style={{
            color: "#f5c542",
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          {step.title}
        </div>
      </div>

      {/* Code — constrained middle region, never grows into the footer */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 60px",
        }}
      >
        <div
          style={{
            backgroundColor: "#1a1a1d",
            color: "#e8e8ea",
            padding: 32,
            borderRadius: 12,
            fontSize: 22,
            lineHeight: 1.7,
            maxWidth: "80%",
            maxHeight: "100%",
            overflow: "hidden",
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
      </div>

      {/* Subtitle — fixed-height footer, always reserved, never overlapped */}
      <div
        style={{
          minHeight: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 60px 40px 60px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.75)",
            color: "#ffffff",
            fontSize: 20,
            lineHeight: 1.5,
            padding: "10px 20px",
            borderRadius: 8,
            maxWidth: "90%",
            textAlign: "center",
            fontFamily: "sans-serif",
          }}
        >
          {step.explanation}
        </div>
      </div>
    </AbsoluteFill>
  );
}