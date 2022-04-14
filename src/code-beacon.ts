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
  return parse(hlCode).children;
}

type SyntaxNode = {
  type: string;
  text: string;
  parent: SyntaxNode | null;
  children: SyntaxNode[];
};

const REGEX_OPEN = /^<span class="([^"]*)".*?>/;
const REGEX_BODY = /^([^<]+)/;
const REGEX_CLOSE = /^<\/span>/;

export function parse(hlCode: string): SyntaxNode {
  let open = 0;

  const tree: SyntaxNode = {
    type: "ROOT",
    text: "",
    parent: null,
    children: [],
  };
  let currTree = tree;

  const nextNode = (parent: SyntaxNode) => {
    const n = {
      type: "",
      text: "",
      parent,
      children: [],
    };
    parent.children.push(n);
    currTree = parent;
    return n;
  };

  let currNode = nextNode(currTree);

  while (hlCode !== "") {
    // only one will match
    const matchOpen = hlCode.match(REGEX_OPEN);
    const matchBody = hlCode.match(REGEX_BODY);
    const matchClose = hlCode.match(REGEX_CLOSE);

    if (matchOpen) {
      if (open > 0) {
        // already open, so nesting
        const textRef = currNode.text;
        currNode.text = "";
        currNode = nextNode(currNode);
        if (textRef) {
          currNode.text = textRef;
        }
      }
      currNode.type = matchOpen[1];

      hlCode = hlCode.replace(REGEX_OPEN, "");
      open++;
    } else if (matchBody) {
      currNode.text = matchBody[1];
      if (open === 0) {
        currNode = nextNode(currTree);
      }

      hlCode = hlCode.replace(REGEX_BODY, "");
    } else if (matchClose) {
      if (open > 0 && currNode.parent) {
        console.log("before", currTree.type, currNode.parent.type);
        currNode = nextNode(currNode.parent);
        console.log("after", currTree.type, currNode.parent.type);
      }

      hlCode = hlCode.replace(REGEX_CLOSE, "");
    } else {
      throw new Error("found no matches");
    }

    // stack.push(currentNode as SyntaxNode);
  }

  return tree;
}
