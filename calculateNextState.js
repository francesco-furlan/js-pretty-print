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
        isObjKey: !currentlyInsideArray,
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
        insideObject: prevIsInsideObject,
        insideArray: arrDepth > 0,
        currentlyInsideArray,
        isObjKey: !currentlyInsideArray,
      },
    };
  } else {
    return {
      ...baseStateData,
      next: initialState,
    };
  }
};

module.exports = {
  calculateNextState,
};
