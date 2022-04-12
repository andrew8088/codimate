import { CodeOutput } from "./code-beacon";

export const Code = ({ code }: { code: CodeOutput }) => {
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
