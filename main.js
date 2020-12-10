const { dataToMetaArray } = require("./dataToMetaArray");
const {
  EMPTY_STATE,
  calculateSymbolState,
  calculateNextState,
} = require("./calculateNextState");
const { formatValue } = require("./formatValue");
const { calculateText } = require("./calculateText");

const prettyPrint = (data, indentation = 2) => {
  const result = dataToMetaArray(data);
  const { formatted } = result.reduce(
    (acc, currentItem, index, originalArray) => {
      const { symbol, current, next } = calculateNextState(
        acc,
        currentItem,
        indentation
      );

      const currentDepthSpaces = new Array(current.totalDepthSpaces)
        .fill(" ")
        .join("");

      const nextItem = originalArray[index + 1];

      const { isClosingSymbol: nextItemIsClosingSymbol } = calculateSymbolState(
        nextItem
      );

      const formattedValue = formatValue(
        currentItem,
        nextItem,
        !nextItem || nextItemIsClosingSymbol
      );
      const currentState = {
        currentDepthSpaces,
        currentItem,
        formattedValue,
        isObjKey: current.isObjKey,
        insideObject: current.insideObject,
        insideArray: current.insideArray,
        currentlyInsideArray: current.currentlyInsideArray,
      };
      const nextState = { next, nextItem };
      const symbolState = {
        ...symbol,
        nextItemIsClosingSymbol,
      };

      const text = calculateText(symbolState, currentState, nextState);

      return { ...next, formatted: `${current.formatted}${text}` };
    },
    EMPTY_STATE
  );
  console.log(formatted);
  return formatted;
};

module.exports = {
  prettyPrint,
};
