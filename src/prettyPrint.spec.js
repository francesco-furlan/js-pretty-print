const { describe, it, expect } = require("@jest/globals");
const { prettyPrint } = require("./prettyPrint");

describe("Pretty print", () => {
  describe("Simple value", () => {
    it("should return undefined", () => {
      expect(prettyPrint()).toBe("undefined");
    });

    it("should return a number without quotes", () => {
      expect(prettyPrint(10)).toBe("10");
    });

    it("should return a float without quotes", () => {
      expect(prettyPrint(10.22)).toBe("10.22");
    });

    it("should return a string with quotes", () => {
      expect(prettyPrint("test")).toBe('"test"');
    });

    it("should return a boolean without quotes", () => {
      expect(prettyPrint(true)).toBe("true");
    });

    it("should return a date like JSON.stringify", () => {
      const date = new Date();
      expect(prettyPrint(date)).toBe(JSON.stringify(date));
    });
  });

  describe("Array", () => {
    it("should return an empty array", () => {
      expect(prettyPrint([])).toBe("[]");
    });

    it("should return an array with 4 numbers like JSON.stringify with 1 indentation", () => {
      const array = [1, 2, 3, 4];
      expect(prettyPrint(array, 1)).toBe(JSON.stringify(array, null, 1));
    });

    it("should return an array with 4 numbers like JSON.stringify with 2 indentation", () => {
      const array = [1, 2, 3, 4];
      expect(prettyPrint(array)).toBe(JSON.stringify(array, null, 2));
    });

    it("should return an array with 2 empty arrays like JSON.stringify with 2 indentation", () => {
      const array = [[], []];
      expect(prettyPrint(array)).toBe(JSON.stringify(array, null, 2));
    });

    it("should return an array with 2 arrays like JSON.stringify with 2 indentation", () => {
      const array = [
        [1, 2],
        [3, 4],
      ];
      expect(prettyPrint(array)).toBe(JSON.stringify(array, null, 2));
    });

    it("should return an array with 1 array and 1 empty array like JSON.stringify with 2 indentation", () => {
      const array = [[1, 2], []];
      expect(prettyPrint(array)).toBe(JSON.stringify(array, null, 2));
    });

    it("should return an array with 1 empty array and 1 array like JSON.stringify with 2 indentation", () => {
      const array = [[], [1, 2]];
      expect(prettyPrint(array)).toBe(JSON.stringify(array, null, 2));
    });
  });

  describe("Object", () => {
    it("should return an empty object", () => {
      expect(prettyPrint({})).toBe("{}");
    });

    it("should return an object with 2 key-values like JSON.stringify with 1 indentation", () => {
      const object = { a: "b", c: 1 };
      expect(prettyPrint(object, 1)).toBe(JSON.stringify(object, null, 1));
    });

    it("should return an object with 2 key-values like JSON.stringify with 2 indentation", () => {
      const object = { a: "b", c: 1 };
      expect(prettyPrint(object)).toBe(JSON.stringify(object, null, 2));
    });

    it("should return an object with 2 empty objects like JSON.stringify with 2 indentation", () => {
      const object = { a: {}, b: {} };
      expect(prettyPrint(object)).toBe(JSON.stringify(object, null, 2));
    });

    it("should return an object with 2 objects like JSON.stringify with 2 indentation", () => {
      const object = { a: { b: "10" }, c: { d: 100 } };
      expect(prettyPrint(object)).toBe(JSON.stringify(object, null, 2));
    });

    it("should return an object with 1 object and 1 empty object like JSON.stringify with 2 indentation", () => {
      const object = { a: { b: "10" }, c: {} };
      expect(prettyPrint(object)).toBe(JSON.stringify(object, null, 2));
    });

    it("should return an object with 1 empty object and 1 object like JSON.stringify with 2 indentation", () => {
      const object = { a: {}, b: { c: "10" } };
      expect(prettyPrint(object)).toBe(JSON.stringify(object, null, 2));
    });
  });
});
