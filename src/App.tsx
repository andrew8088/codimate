import { useState, useEffect, useCallback } from "react";
// import highlight from "highlight.js";
// import ts from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/nord.css";
import "./App.css";

// highlight.registerLanguage("typescript", ts);

const textColors = ["#81a1c1", "#d8dee9", "#8fbcbb"] as const;

type CodeChar = {
  char: string;
  color: typeof textColors[number];
};

function toChars(code: string): CodeChar[][] {
  return code
    .trim()
    .split("\n")
    .map((line) =>
      line.split("").map((char) => ({
        char: char,
        color: textColors[0],
        // color: textColors[i++ % textColors.length]
      }))
    );
}
const CODE = toChars(`
type AnyFunction = (...args: any[]) => any;
type User = { type: "teacher"} | { type: "parent"};
`);

function slice2D<T>(arr: T[][], idx: number): T[][] {
  const ret: T[][] = [];

  for (const item of arr) {
    if (item.length >= idx) {
      ret.push(item.slice(0, idx));
      return ret;
    } else {
      idx -= item.length;
      ret.push(item);
    }
  }
  return ret;
}

function clearLines(arr: CodeChar[][], lineNos: number[]): CodeChar[][] {
  return arr.map((line: CodeChar[], idx: number) =>
    lineNos.includes(idx)
      ? line
      : line.map((char: CodeChar) => ({ ...char, char: " " }))
  );
}

const stages = [[], [0], [0, 1]];

function App() {
  return <CodeContainer code={CODE} stages={stages} />;
}

export default App;

const useIncrDecr = (start: number) => {
  const [count, setCount] = useState(start);
  const incr = () => setCount((c) => c + 1);
  const decr = () => setCount((c) => c - 1);
  return [count, incr, decr] as const;
};

const useClampedIncrDecr = (start: number, min: number, max: number) => {
  const [count, incr, decr] = useIncrDecr(start);
  const clampedIncr = () => (count < max ? incr() : undefined);
  const clampedDecr = () => (count > min ? decr() : undefined);
  return [count, clampedIncr, clampedDecr] as const;
};

const CodeContainer = ({
  code,
  stages,
}: {
  code: CodeChar[][];
  stages: number[][];
}) => {
  const [count, incr, decr] = useClampedIncrDecr(0, 0, stages.length - 1);

  const displayCodePrev = stages[count - 1]
    ? clearLines(code, stages[count - 1])
    : clearLines(code, stages[0]);

  const displayCodeCurr = stages[count]
    ? clearLines(code, stages[count])
    : code;

  console.log(displayCodePrev.map((l) => l.map((c) => c.char)));
  console.log(displayCodeCurr.map((l) => l.map((c) => c.char)));

  const handler = ({ key }: { key: string }) => {
    switch (key) {
      case "ArrowRight":
        return incr();
      case "ArrowLeft":
        return decr();
      default:
        return;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handler]);

  return <Code code={displayCodeCurr} />;
};

const Code = ({ code }: { code: CodeChar[][] }) => {
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
