const hello = require("../code/index");

describe("simple test.", () => {
  test("empty string", () => {
    expect(hello("")).toEqual("hello");
  });
});
