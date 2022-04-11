import { useEffect, useCallback, useState } from "react";
import "./App.css";
import { useGenerator } from "use-iterator";
import { generator, CodeOutput } from "./code-beacon";

const CODE = `
function App() {
  return (
    <div className="main">
      <CodeContainer code={CODE} stages={stages} />;
    </div>
  );
}
`;

const stages = [
  [0, 6],
  [0, 1, 5, 6],
  [0, 1, 2, 4, 5, 6],
  [0, 1, 2, 3, 4, 5, 6],
];

function App() {
  return (
    <div className="main">
      <CodeContainer code={CODE} stages={stages} />;
    </div>
  );
}

export default App;

const CodeContainer = ({
  code,
  stages,
}: {
  code: string;
  stages: number[][];
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
      setTimeout(step, 10);
    }
  }, [result]);

  return <Code code={result.value ? result.value.code : prevState} />;
};

const Code = ({ code }: { code: CodeOutput }) => {
  return (
    <div className="code">
      {code.map((line, idx) => (
        <div key={idx} className="line">
          <div className="lineNo">{idx + 1}</div>
          {line.map((char, charIdx) => (
            <pre key={charIdx} className="lineCode">
              {char.char}
            </pre>
          ))}
        </div>
      ))}
    </div>
  );
};
