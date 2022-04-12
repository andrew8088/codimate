import { useEffect, useCallback, useState } from "react";
import { useGenerator } from "use-iterator";
import { generator, CodeOutput } from "./code-beacon";
import { Code } from "./Code";

export const CodeContainer = ({
  code,
  stages,
  delay = 10,
}: {
  code: string;
  stages: number[][];
  delay?: number;
}) => {
  const result = useGenerator(() => generator(code, stages), [code, stages]);
  const [prevState, setPrevState] = useState<CodeOutput>(
    result.value ? result.value.code : []
  );

  const step = () => {
    if (result.value) setPrevState(result.value.code);
    if (!result.done) {
      result.next();
    }
  };

  const handler = useCallback(
    ({ key }: { key: string }) => {
      if (key === "ArrowRight") step();
    },
    [result]
  );

  useEffect(() => {
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handler]);

  useEffect(() => {
    if (!result.value?.stepDone) {
      setTimeout(step, delay);
    }
  }, [result]);

  return <Code code={result.value ? result.value.code : prevState} />;
};
