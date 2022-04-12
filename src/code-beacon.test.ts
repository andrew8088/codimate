import { generator, joinAll, parse } from "./code-beacon";

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
    const out = parse(`
function someName(param1:string): string {
  console.log("one", 2, new Date(), false);
  return param1.toUpperCase();
}
`);

    console.log(out);
  });
});
