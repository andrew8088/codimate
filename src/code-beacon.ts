import hljs from "highlight.js/lib/core";

hljs.registerLanguage("ts", require("highlight.js/lib/languages/typescript"));

// hljs.addPlugin({
//   "after:highlight": (result) => console.log("after:highlight", result._top),
// });

export type CodeCharacter = {
  char: string;

  color: string;
};

export type CodeStep = number[];
export type CodeOutput = CodeCharacter[][];

export type GeneratorOut = {
  code: CodeOutput;
  stepDone: boolean;
};

export function* generator(
  code: string,
  steps: CodeStep[]
): Generator<GeneratorOut, void, void> {
  const current: CodeOutput = code
    .trim()
    .split("\n")
    .map((line) => line.split("").map((_) => ({ char: " ", color: "white" })));

  yield {
    code: JSON.parse(JSON.stringify(current)),
    stepDone: true,
  };

  for (let step of steps) {
    const endOfStep: CodeOutput = code
      .trim()
      .split("\n")
      .map((line, lineIdx) =>
        line.split("").map((char) => ({
          char: step.includes(lineIdx) ? char : " ",
          color: "white",
        }))
      );

    for (let i = 0; i < current.length; i++) {
      for (let j = 0; j < current[i].length; j++) {
        if (current[i][j].char !== endOfStep[i][j].char) {
          current[i][j].char = endOfStep[i][j].char;
          yield {
            code: JSON.parse(JSON.stringify(current)),
            stepDone: false,
          };
        }
      }
    }
    yield {
      code: JSON.parse(JSON.stringify(current)),
      stepDone: true,
    };
  }
}

export function joinAll(v: GeneratorOut): { code: string; stepDone: boolean } {
  return {
    ...v,
    code: v.code
      .map((line: CodeCharacter[]) => line.map((c) => c.char).join(""))
      .join("")
      .trim(),
  };
}

type SyntaxNode = {
  text: string;
  type: "default" | "keyword";
};

export function parse(code: string): SyntaxNode[] {
  const hlCode = hljs
    .highlight(code, {
      language: "ts",
    })
    .value.trim();

  const stack: string[] = [];

  let regex = /<span class="([^"]*)".*?>/;

  const match = hlCode.match(regex);

  console.log(match);

  return [];
}
