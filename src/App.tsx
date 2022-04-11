import { useEffect, useCallback } from "react";
import "./App.css";
import { useGenerator } from "use-iterator";
import { generator, CodeOutput, joinAll } from "./code-beacon";

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
  const result = useGenerator(() => generator(code, stages), [code, stages]);

  const handler = useCallback(
    ({ key }: { key: string }) => {
      if (key === "ArrowRight") {
        result.next();
      }
    },
    [result]
  );

  useEffect(() => {
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handler]);

  return <Code code={result.value.code} />;
};

const Code = ({ code }: { code: CodeOutput }) => {
  console.log(code);
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
  fontFamily: '"Hack"',
  fontWeight: "bold",
  margin: 0,
};
