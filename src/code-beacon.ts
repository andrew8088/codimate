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

export function toNodes(code: string): SyntaxNode[] {
  let hlCode = hljs.highlight(code.trim(), { language: "ts" }).value.trim();
  return parse(hlCode);
}

type SyntaxNode = {
  type: string;
  text: string;
  children: SyntaxNode[];
};

const REGEX_START = /^<span class="([^"]*)".*?>/;
const REGEX_MIDDLE = /^([^<]+)/;
const REGEX_END = /^<\/span>/;

export function parse(hlCode: string, tree: SyntaxNode[]): SyntaxNode[] {
  if (tree.length === 0) {
    tree.push({
      type: "",
      text: "",
      children: [],
    });
  }

  let open = 0;
  const curr = tree[tree.length - 1];

  while (hlCode !== "") {
    const matchStart = hlCode.match(REGEX_START);

    if (matchStart) {
      console.log("match start", hlCode);
      open++;
      curr.type = matchStart[1];
      hlCode = hlCode.replace(REGEX_START, "");
    } else {
      const matchMiddle = hlCode.match(REGEX_MIDDLE);
      if (matchMiddle) {
        console.log("match middle", hlCode);
        curr.text = matchMiddle[1];
        curr.type = "default";
        hlCode = hlCode.replace(REGEX_MIDDLE, "");
      } else {
        if (open > 0) {
          console.log("has opens, checking for closes");
          const matchEnd = hlCode.match(REGEX_END);
          if (matchEnd) {
            hlCode = hlCode.replace(REGEX_END, "");
          } else {
            throw new Error("no start or middle");
          }
        } else {
          throw new Error("no start or middle");
        }
      }
    }

    // stack.push(currentNode as SyntaxNode);
  }

  return tree;
}
