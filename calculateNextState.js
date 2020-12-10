const EMPTY_STATE = {
  symbol: {
    isSymbolChar: false,
    isOpenObjChar: false,
    isCloseObjChar: false,
    isOpenArrChar: false,
    isCloseArrChar: false,
    isOpeningSymbol: false,
    isClosingSymbol: false,
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
};

const calculateSymbolState = (item) => {
  const isOpenArrChar = item === "[";
  const isCloseArrChar = item === "]";
  const isOpenObjChar = item === "{";
  const isCloseObjChar = item === "}";
  return {
    isOpenArrChar,
    isCloseArrChar,
    isOpenObjChar,
    isCloseObjChar,
    isOpeningSymbol: isOpenArrChar || isOpenObjChar,
    isClosingSymbol: isCloseArrChar || isCloseObjChar,
    isSymbolChar:
      isOpenArrChar || isCloseArrChar || isOpenObjChar || isCloseObjChar,
  };
};

const isCurrentlyInsideArray = (stack) => stack[stack.length - 1] === "[";

const calculateNextState = (initialState, item, depthIncrement) => {
  const {
    stack: prevStack,
    totalDepthSpaces: prevDepth,
    objDepth: prevObjDepth,
    arrDepth: prevArrDepth,
    insideObject: prevIsInsideObject,
    insideArray: prevIsInsideArray,
    isObjKey: prevIsObjKey,
    currentlyInsideArray: prevIsCurrentlyInsideArray,
  } = initialState;
  const symbolState = calculateSymbolState(item);
  const baseStateData = { symbol: symbolState, item, current: initialState };

  if (symbolState.isOpenObjChar) {
    return {
      ...baseStateData,
      next: {
        totalDepthSpaces: prevDepth + depthIncrement,
        objDepth: prevObjDepth + 1,
        stack: [...prevStack, item],
        arrDepth: prevArrDepth,
        insideObject: true,
        insideArray: prevIsInsideArray,
        currentlyInsideArray: false,
        isObjKey: true,
      },
    };
  } else if (symbolState.isCloseObjChar) {
    const objDepth = prevObjDepth - 1;
    const stack = prevStack.slice(0, -1);
    const currentlyInsideArray = isCurrentlyInsideArray(stack);
    return {
      ...baseStateData,
      next: {
        stack,
        totalDepthSpaces: prevDepth - depthIncrement,
        objDepth,
        arrDepth: prevArrDepth,
        insideObject: objDepth > 0,
        insideArray: prevIsInsideArray,
        currentlyInsideArray,
        isObjKey: true,
      },
    };
  } else if (symbolState.isOpenArrChar) {
    return {
      ...baseStateData,
      next: {
        stack: [...prevStack, item],
        totalDepthSpaces: prevDepth + depthIncrement,
        objDepth: prevObjDepth,
        arrDepth: prevArrDepth + 1,
        insideObject: false,
        insideArray: true,
        currentlyInsideArray: true,
        isObjKey: false,
      },
    };
  } else if (symbolState.isCloseArrChar) {
    const arrDepth = prevArrDepth - 1;
    const stack = prevStack.slice(0, -1);
    const currentlyInsideArray = isCurrentlyInsideArray(stack);
    return {
      ...baseStateData,
      next: {
        stack,
        totalDepthSpaces: prevDepth - depthIncrement,
        objDepth: prevObjDepth,
        arrDepth,
        insideObject: prevObjDepth > 0,
        insideArray: arrDepth > 0,
        currentlyInsideArray,
        isObjKey: !currentlyInsideArray,
      },
    };
  } else {
    const lastWasInsideObjOrArray = prevIsInsideObject || prevIsInsideArray;

    // If the previous item was inside an obj or an array,
    // we calculate the new isObjKey based on the previous context
    // (if it was inside an object and not in an array then it was a key`).
    // Otherwise we take the previous isObjKey.
    const isObjKeyBasedOnPrevValue = lastWasInsideObjOrArray
      ? prevIsInsideObject && !prevIsCurrentlyInsideArray
      : prevIsObjKey;

    // If the previous item was a key then the current will be a value.
    // Otherwise
    const lastWasObjKey = prevIsInsideObject && prevIsObjKey;
    const isObjKey = lastWasObjKey ? false : isObjKeyBasedOnPrevValue;
    return {
      ...baseStateData,
      next: {
        ...initialState,
        isObjKey,
      },
    };
  }
};

module.exports = {
  EMPTY_STATE,
  calculateSymbolState,
  calculateNextState,
};
