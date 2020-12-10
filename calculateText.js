const calculateText = (symbolState, currentState, nextState) => {
  const {
    currentDepthSpaces,
    currentItem,
    formattedValue,
    isObjKey,
    insideObject,
    insideArray,
    currentlyInsideArray,
  } = currentState;
  const { next, nextItem } = nextState;
  const {
    isSymbolChar,
    isClosingSymbol,
    isCloseArrChar,
    isOpenObjChar,
    isCloseObjChar,
    nextItemIsClosingSymbol,
  } = symbolState;

  if (isSymbolChar) {
    const newLine = nextItem ? "\n" : "";

    const comma =
      isClosingSymbol && !nextItemIsClosingSymbol && nextItem ? "," : "";

    const specialCharSpaces =
      (insideObject || insideArray) && isClosingSymbol
        ? new Array(next.totalDepthSpaces).fill(" ").join("")
        : "";

    const currentCharIsInArray = currentlyInsideArray && !isCloseArrChar;

    const spaces = currentCharIsInArray
      ? currentDepthSpaces
      : specialCharSpaces;

    const text = `${spaces}${currentItem}${comma}${newLine}`;

    const nextIsKey =
      (isCloseArrChar && !next.currentlyInsideArray) ||
      isOpenObjChar ||
      isCloseObjChar;

    return { text, nextIsKey };
  } else if (insideObject && isObjKey) {
    const text = `${currentDepthSpaces}"${currentItem}": `;
    return { text, nextIsKey: false };
  } else if (insideObject || insideArray) {
    const spaces = isObjKey || currentlyInsideArray ? currentDepthSpaces : "";
    const nextIsKey = insideObject && !currentlyInsideArray;
    const text = `${spaces}${formattedValue}`;
    return { text, nextIsKey };
  } else {
    return { text: formattedValue, nextIsKey: isObjKey };
  }
};

module.exports = { calculateText };
