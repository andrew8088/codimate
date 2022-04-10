import { generator, joinAll } from "./code-beacon";

describe("CodeBeacon Generator", () => {
  it("steps through the characters of the code", () => {
    const code = "const";
    const g = generator(code, [[0]]);
    const out = Array.from(g).map(joinAll);
    expect(out).toEqual([
      "",
      "true",
      "c",
      "co",
      "con",
      "cons",
      "const",
      "true",
    ]);
  });

  it("steps though characters with an array per line", () => {
    const code = "const;\nlet";
    const g = generator(code, [[0, 1]]);
    const out = Array.from(g).map(joinAll);
    expect(out[7]).toEqual("const;");
    expect(out[out.length - 2]).toEqual("const;let");
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

    const [start, _, ...out]: string[] = Array.from(g).map(joinAll);

    expect(start).toEqual("");

    const endOfStep1 = out.findIndex((item) => item === "true");
    expect(out[endOfStep1 - 1]).toEqual(
      "const one = 1;              const three = 3;"
    );
    expect(out[out.length - 4]).toEqual(
      "const one = 1;const two =   const three = 3;"
    );
    expect(out[out.length - 3]).toEqual(
      "const one = 1;const two = 2 const three = 3;"
    );
    expect(out[out.length - 2]).toEqual(
      "const one = 1;const two = 2;const three = 3;"
    );
  });
});
