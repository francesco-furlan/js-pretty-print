/* eslint-disable @typescript-eslint/no-var-requires, functional/immutable-data */
const path = require("path");

const realativeCoverageRoot = path.relative(__dirname, process.cwd());

module.exports = {
  testMatch: [path.join(process.cwd(), "**/*.spec.js")],
  coverageDirectory: path.join(process.cwd(), "coverage"),
  collectCoverageFrom: ["src/*.js"].map((stringPath) =>
    stringPath[0] !== "!"
      ? path.join(realativeCoverageRoot, stringPath)
      : `!${path.join(realativeCoverageRoot, stringPath.slice(1))}`
  ),
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 95,
      functions: 95,
      lines: 95,
    },
  },
};
