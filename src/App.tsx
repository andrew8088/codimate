import { useState, useEffect } from "react";
import highlight from "highlight.js";
import ts from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/nord.css";
import "./App.css";

highlight.registerLanguage("typescript", ts);

const code1 = `
type AnyFunction = (...args: any[]) => any;

function optional<Fn extends AnyFunction>(fn: Fn, errHandler?: (e: any) => void) {







}
`.trim();

const code2 = `
type AnyFunction = (...args: any[]) => any;

function optional<Fn extends AnyFunction>(fn: Fn, errHandler?: (e: any) => void) {
  return function (...args: Parameters<Fn>): ReturnType<Fn> | void {





  }
}
`.trim();

const code3 = `
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
`.trim();

const slides = [code1, code2, code3];

function App() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [charCount, setCharCount] = useState(10);
  const out = highlight
    .highlight(code1.trim().slice(0, charCount), {
      language: "typescript",
    })
    .value.split("\n");

  useEffect(() => {
    setTimeout();

    // const id = setInterval(() => setCharCount((c) => c + 1), 20);
    // return () => clearInterval(id);
  }, []);

  return (
    <div className="hljs" style={wrapperStyle}>
      {code1
        .trim()
        .split("\n")
        .map((_, idx) => (
          <div style={rowStyle}>
            <div style={{ ...codeStyle, ...lineNumStyle }}>{idx + 1}</div>
            <pre
              style={codeStyle}
              dangerouslySetInnerHTML={{ __html: out[idx] }}
            />
          </div>
        ))}
    </div>
  );
}

export default App;

const Line = ({ lineNo, code }: { lineNo: number; code: string }) => {};

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

function explodeMarkup(code: string): string {
  return code;
}
