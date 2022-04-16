import hljs from "highlight.js/lib/core";

hljs.registerLanguage("ts", require("highlight.js/lib/languages/typescript"));

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

export function toNodes(code: string) {
  let hlCode = hljs.highlight(code.trim(), { language: "ts" }).value.trim();
  return parse(hlCode);
}

type SyntaxNode = {
  type: string;
  value: SyntaxNode[] | string;
};

const REGEX_OPEN = /^<span class="([^"]*)".*?>/;
const REGEX_BODY = /^([^<]+)/;
const REGEX_CLOSE = /^<\/span>/;

export function parse(
  hlCode: string,
  tree: SyntaxNode[] = []
): [string, SyntaxNode[]] {
  while (hlCode) {
    // only one will match
    const matchOpen = hlCode.match(REGEX_OPEN);
    const matchBody = hlCode.match(REGEX_BODY);
    const matchClose = hlCode.match(REGEX_CLOSE);

    if (matchOpen) {
      const [newCode, subTree] = parse(hlCode.replace(REGEX_OPEN, ""));
      tree.push({ type: matchOpen[1], value: subTree });
      hlCode = newCode;
    } else if (matchBody) {
      tree.push({ type: "text", value: matchBody[1] });
      hlCode = hlCode.replace(REGEX_BODY, "");
    } else if (matchClose) {
      return [hlCode.replace(REGEX_CLOSE, ""), tree];
    } else {
      throw new Error("no matches found");
    }
  }

  return ["", tree];
}
