const wrapSymbol = (isOpenSymbol, value, depth) => ({
  isOpenSymbol,
  isCloseSymbol: !isOpenSymbol,
  value,
  depth,
});
const wrapOpenArray = (depth) => wrapSymbol(true, "[", depth);
const wrapOpenObj = (depth) => wrapSymbol(true, "{", depth);
const wrapCloseArray = (depth) => wrapSymbol(false, "]", depth);
const wrapCloseObj = (depth) => wrapSymbol(false, "}", depth);

const wrapArrayValue = (value, depth) => ({
  isArrayValue: true,
  value,
  depth,
});

const wrapObj = (isObjKey, value, depth) => ({
  isObjKey,
  isObjValue: !isObjKey,
  value,
  depth,
});

const dataToMetaArray = (
  data,
  depthIncrement = 1,
  depth = 0,
  additionalMeta = {}
) => {
  const incrementedDepth = depth + depthIncrement;
  if (typeof data === "object") {
    let result = [];
    if (Array.isArray(data)) {
      const mappedArr = data.flatMap((value) =>
        dataToMetaArray(
          value,
          depthIncrement,
          incrementedDepth,
          wrapArrayValue()
        )
      );
      return [
        ...result,
        wrapOpenArray(depth),
        ...mappedArr,
        wrapCloseArray(depth),
      ];
    } else if (data instanceof Date) {
      return [
        ...result,
        { ...additionalMeta, value: data.toISOString(), depth },
      ];
    } else {
      const stringifiedObj = Object.entries(data).flatMap(([key, value]) => {
        const stringifiedValue = dataToMetaArray(
          value,
          depthIncrement,
          incrementedDepth,
          wrapObj()
        );
        return [wrapObj(true, key, incrementedDepth), ...stringifiedValue];
      });
      return [
        ...result,
        wrapOpenObj(depth),
        ...stringifiedObj,
        wrapCloseObj(depth),
      ];
    }
  } else {
    return [{ ...additionalMeta, value: data, depth }];
  }
};

module.exports = {
  dataToMetaArray,
};
