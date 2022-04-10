import { useState, useRef } from "react";
import {
  generator,
  GeneratorOut,
  CodeOutput,
  CodeStep,
  joinAll,
} from "./code-beacon";

function assertsCode(input: GeneratorOut | void): asserts input is CodeOutput {
  if (!input || typeof input === "boolean") throw Error("must be code");
}

export function useCodeBeacon(
  code: string,
  steps: CodeStep[]
): [CodeOutput, () => void] {
  const [value, next] = useGenerator([], () => generator(code, steps));

  assertsCode(value);

  const [currentCode, setCurrentCode] = useState<CodeOutput>(value);

  // console.log("Hook start");
  // const g = useRef(generator(code, steps));

  // const first = g.current.next().value;

  // console.log(joinAll(first));
  // const [currentCode, setCurrentCode] = useState<CodeOutput>(first);

  const tick = () => {
    next();
    console.log(joinAll(value.value));

    if (value.done) return;

    if (value.value === true) {
      console.log("STEP COMPLETE");
      // tick();
    } else {
      setCurrentCode(value.value);
    }
  };

  return [currentCode, next];
}

function useGenerator<T>(
  defaultValue: T,
  createGenerator: () => Generator<T>
): [T, () => void] {
  const effect = useRef<Generator<T> | null>(createGenerator());

  const nextRef = useRef<() => void>(() => {
    if (!effect.current) return;

    const newValue = effect.current.next();

    if (newValue.done) {
      effect.current = null;
      return;
    }

    setValue(newValue.value);
  });
  const [value, setValue] = useState<T>();

  nextRef.current();

  return [value, nextRef.current];
}
