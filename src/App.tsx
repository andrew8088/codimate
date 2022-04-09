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

const code1 = toChars(`
type AnyFunction = (...args: any[]) => any;

function optional<Fn extends AnyFunction>(fn: Fn, errHandler?: (e: any) => void) {







}
`);

const code2 = toChars(`
type AnyFunction = (...args: any[]) => any;

function optional<Fn extends AnyFunction>(fn: Fn, errHandler?: (e: any) => void) {
  return function (...args: Parameters<Fn>): ReturnType<Fn> | void {





  }
}
`);

const code3 = toChars(`
type AnyFunction = (...args: any[]) => any;

function optional<Fn extends AnyFunction>(fn: Fn, errHandler?: (e: any) => void) {
  return function (...args: Parameters<Fn>): ReturnType<Fn> | void {
      try {
          return fn(...args);
      } catch (err) {
            errHandler?.(err);
      }
  }
}
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

const stages = [
  [0, 1, 2, 10],
  [0, 1, 2, 3, 9, 10],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
];

function App() {
  return <CodeContainer code={code3} />;
}

export default App;

const CodeContainer = ({ code }: { code: CodeChar[][] }) => {
  const totalLength = code.reduce((acc, next) => acc + next.length, 0);
  const [len, setLen] = useState(0);

  const handler = useCallback(
    (evt: { key: string }) => {
      if (evt.key === "ArrowRight" && len <= totalLength) {
        setLen((i) => i + 1);
      }
      if (evt.key === "ArrowLeft" && len <= totalLength) {
        setLen((i) => i - 1);
      }
    },
    [len, totalLength]
  );

  useEffect(() => {
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handler]);

  return <Code code={clearLines(code, stages[len])} />;
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
