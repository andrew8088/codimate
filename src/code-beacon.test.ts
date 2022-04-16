import { generator, joinAll, parse, toNodes } from "./code-beacon";

describe("CodeBeacon Generator", () => {
  it("steps through the characters of the code", () => {
    const code = "const";
    const g = generator(code, [[0]]);
    const out = Array.from(g)
      .map(joinAll)
      .map((v) => v.code);
    expect(out).toEqual(["", "c", "co", "con", "cons", "const", "const"]);
  });

  it("steps though characters with an array per line", () => {
    const code = "const;\nlet";
    const g = generator(code, [[0, 1]]);
    const out = Array.from(g)
      .map(joinAll)
      .map((v) => v.code);
    expect(out[6]).toEqual("const;");
    expect(out[out.length - 1]).toEqual("const;let");
  });

  it("replaces chosen lines with spaces the first time, displays them the second time", () => {
    const code = `
const one = 1;
const two = 2;
const three = 3;
`;
    const g = generator(code, [
      [0, 2],
      [0, 1, 2],
    ]);

    const [start, ...out] = Array.from(g).map(joinAll);

    expect(start.code).toEqual("");

    const stepOneIndex = out.findIndex((item) => item.stepDone);

    expect(out[stepOneIndex].code).toEqual(
      "const one = 1;              const three = 3;"
    );

    expect(out[out.length - 4].code).toEqual(
      "const one = 1;const two =   const three = 3;"
    );
    expect(out[out.length - 3].code).toEqual(
      "const one = 1;const two = 2 const three = 3;"
    );
    expect(out[out.length - 2].code).toEqual(
      "const one = 1;const two = 2;const three = 3;"
    );
  });

  it("highlights", () => {
    const input = `prefix<span class="outside">foo<span class="inside">bar</span></span>suffix`;
    const [, out] = parse(input);
    const [prefix, outside, suffix] = out;

    expect(prefix).toMatchObject({ value: "prefix", type: "text" });
    expect(suffix).toMatchObject({ value: "suffix", type: "text" });
    expect(outside).toMatchObject({
      type: "outside",
      value: [
        {
          type: "text",
          value: "foo",
        },
        {
          type: "inside",
          value: [{ type: "text", value: "bar" }],
        },
      ],
    });
  });

  it("highlights", () => {
    const input = `prefix<span class="outside">foo<span class="inside">bar</span></span>suffix`;
    const [, out] = parse(input);
    const [prefix, outside, suffix] = out;

    expect(prefix).toMatchObject({ value: "prefix", type: "text" });
    expect(suffix).toMatchObject({ value: "suffix", type: "text" });
    expect(outside).toMatchObject({
      type: "outside",
      value: [
        {
          type: "text",
          value: "foo",
        },
        {
          type: "inside",
          value: [{ type: "text", value: "bar" }],
        },
      ],
    });
  });

//   it("works", () => {
//     const input = `
// function nest(
//   stack: StackItem[],
//   tree: SyntaxNode[] = []
// ): [StackItem[] | null, SyntaxNode[]] {
//   while (stack) {
//     const item = stack.shift();
//     if (!item) return [null, tree];

//     if (item.type === "open") {
//       tree.push({
//         type: item.text,
//         value: nest(stack, [])[1],
//       });
//     } else if (item.type === "body") {
//       tree.push({ type: "text", value: item.text });
//     } else if (item.type === "close") {
//       return [stack, tree];
//     }
//   }

//   return [stack, tree];
// }`;
//     const out = toNodes(input);
//     console.log(JSON.stringify(out, null, "  "));
//   });
});
