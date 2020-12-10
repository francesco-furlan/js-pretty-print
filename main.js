const { dataToMetaArray } = require("./dataToMetaArray");
const { calculateNextState } = require("./calculateNextState");
const { formatValue } = require("./formatValue");
const { calculateText } = require("./calculateText");

const prettyPrint = (data) => {
  const result = dataToMetaArray(data);
  const depthCount = 2;
  const { formatted } = result.reduce(
    (acc, currentItem, index, originalArray) => {
      const {
        symbol: { isSymbolChar, isOpenObjChar, isCloseObjChar, isCloseArrChar },
        current: {
          insideObject,
          isObjKey,
          totalDepthSpaces,
          insideArray,
          currentlyInsideArray,
          formatted,
        },
        next,
      } = calculateNextState(acc, currentItem, depthCount);

      const nextItem = originalArray[index + 1];
      const nextItemIsClosingSymbol = nextItem === "}" || nextItem === "]";
      const currentDepthSpaces = new Array(totalDepthSpaces).fill(" ").join("");

      const formattedValue = formatValue(
        currentItem,
        nextItem,
        !nextItem || nextItemIsClosingSymbol
      );

      const currentState = {
        currentDepthSpaces,
        currentItem,
        formattedValue,
        isObjKey,
        insideObject,
        insideArray,
        currentlyInsideArray,
      };
      const nextState = { next, nextItem };
      const symbolState = {
        isSymbolChar,
        isClosingSymbol: isCloseObjChar || isCloseArrChar,
        isCloseArrChar,
        isOpenObjChar,
        isCloseObjChar,
        nextItemIsClosingSymbol,
      };

      const { text, nextIsKey } = calculateText(
        symbolState,
        currentState,
        nextState
      );
      const newFormatted = `${formatted}${text}`;
      return { ...next, isObjKey: nextIsKey, formatted: newFormatted };
    },
    {
      symbol: {
        isSymbolChar: false,
        isOpenObjChar: false,
        isCloseObjChar: false,
        isOpenArrChar: false,
        isCloseArrChar: false,
      },
      totalDepthSpaces: 0,
      objDepth: 0,
      arrDepth: 0,
      insideObject: false,
      insideArray: false,
      isObjKey: false,
      formatted: "",
      currentlyInsideArray: false,
      stack: [],
    }
  );
  console.log(formatted);
};

module.exports = {
  prettyPrint,
};
