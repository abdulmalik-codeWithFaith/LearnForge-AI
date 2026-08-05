import { Composition } from "remotion";
import { LessonVideo, type LessonVideoProps } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LessonVideo"
      component={LessonVideo}
      durationInFrames={300}
      fps={30}
      width={1280}
      height={720}
      defaultProps={{
        lessonTitle: "Preview",
        steps: [],
      } as LessonVideoProps}
      calculateMetadata={async ({ props }) => {
        const total = props.steps.reduce(
          (sum, s) => sum + s.durationInFrames,
          0
        );
        return { durationInFrames: Math.max(total, 30) };
      }}
    />
  );
};