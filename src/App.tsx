import { useEffect, useCallback } from "react";
import "highlight.js/styles/nord.css";
import "./App.css";
import { useCodeBeacon } from "./useCodeBeacon";
import { CodeOutput } from "./code-beacon";

// const textColors = ["#81a1c1", "#d8dee9", "#8fbcbb"] as const;

const CODE = `
type AnyFunction = (...args: any[]) => any;
type User = { type: "teacher"} | { type: "parent" };
`;

const stages = [[0], [0, 1]];

function App() {
  return <CodeContainer code={CODE} stages={stages} />;
}

export default App;

const CodeContainer = ({
  code,
  stages,
}: {
  code: string;
  stages: number[][];
}) => {
  const [currentCode, tick] = useCodeBeacon(code, stages);

  const handler = useCallback(
    ({ key }: { key: string }) => {
      tick();
    },
    [tick]
  );

  useEffect(() => {
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handler]);

  return <Code code={currentCode} />;
};

const Code = ({ code }: { code: CodeOutput }) => {
  return (
    <div className="hljs" style={wrapperStyle}>
      {code.map((line, idx) => (
        <div key={idx} style={rowStyle}>
          <div style={{ ...codeStyle, ...lineNumStyle }}>{idx + 1}</div>
          {line.map((char, charIdx) => (
            <pre key={charIdx} style={{ ...codeStyle, color: char.color }}>
              {char.char}
            </pre>
          ))}
        </div>
      ))}
    </div>
  );
};

const wrapperStyle = {
  height: "100%",
  padding: "20px 40px",
  display: "flex",
  flexDirection: "column",
} as const;

const rowStyle = {
  display: "flex",
  flexDirection: "row",
  height: "25px",
} as const;

const lineNumStyle = {
  width: "60px",
  paddingRight: "10px",
  marginRight: "10px",
  textAlign: "right",
} as const;

const codeStyle = {
  fontSize: "20px",
  fontFamily: '"Cascadia Code"',
  fontWeight: "bold",
  margin: 0,
};
