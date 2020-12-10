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
    isOpeningSymbol,
    isClosingSymbol,
    isCloseArrChar,
    nextItemIsClosingSymbol,
  } = symbolState;

  // Compute text when the item is a symbol: '[', ']', '{', '}'
  if (isSymbolChar) {
    // If is a closing symbol and there is a next item
    // and the next item isn't a closing symbol we need to add a comma.
    const comma =
      isClosingSymbol && nextItem && !nextItemIsClosingSymbol ? "," : "";

    const newLine =
      nextItem && !(isOpeningSymbol && nextItemIsClosingSymbol) ? "\n" : "";

    // If the current item is a closing symbol and we're inside an object or an array,
    // we need to use the next depth to calculate the spaces.
    const closingSymbolSpaces =
      isClosingSymbol && (insideObject || insideArray)
        ? new Array(next.totalDepthSpaces).fill(" ").join("")
        : "";

    // If we're currently inside an array and the symbol is not a closing array char,
    // then the current char is in an array.
    const currentCharIsInArray = currentlyInsideArray && !isCloseArrChar;

    const spaces = currentCharIsInArray
      ? currentDepthSpaces
      : closingSymbolSpaces;

    return `${spaces}${currentItem}${comma}${newLine}`;
  }
  // Compute text when the item is an object key.
  else if (insideObject && isObjKey) {
    return `${currentDepthSpaces}"${currentItem}": `;
  }
  // Compute text when the item is an object or an array value.
  else if (insideObject || insideArray) {
    // If we're currently inside an array we need to add the spaces.
    const spaces = currentlyInsideArray ? currentDepthSpaces : "";
    return `${spaces}${formattedValue}`;
  }
  // Return the formatted value otherwise.
  else {
    return formattedValue;
  }
};

module.exports = { calculateText };
