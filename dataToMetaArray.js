const wrapArrayValue = (value, depth) => ({
  isArrayValue: true,
  value,
  depth,
});
const wrapObjKey = (value, depth) => ({
  isObjKey: true,
  value,
  depth,
});
const wrapObjValue = (value, depth) => ({
  isObjValue: true,
  value,
  depth,
});

const wrapOpenArray = (depth) => ({
  isOpenSymbol: true,
  value: "[",
  depth,
});
const wrapOpenObj = (depth) => ({
  isOpenSymbol: true,
  value: "{",
  depth,
});
const wrapCloseArray = (depth) => ({
  isCloseSymbol: true,
  value: "]",
  depth,
});
const wrapCloseObj = (depth) => ({
  isCloseSymbol: true,
  value: "}",
  depth,
});

const dataToMetaArray = (
  data,
  indentation = 1,
  depth = 0,
  additionalMeta = {}
) => {
  if (typeof data === "object") {
    let result = [];
    if (Array.isArray(data)) {
      const mappedArr = data.flatMap((value) =>
        dataToMetaArray(
          value,
          indentation,
          depth + indentation,
          wrapArrayValue(depth + indentation)
        )
      );
      return [
        ...result,
        wrapOpenArray(depth),
        ...mappedArr,
        wrapCloseArray(depth),
      ];
    } else if (data instanceof Date) {
      const valueObj = { ...additionalMeta, value: data.toISOString(), depth };
      return [...result, valueObj];
    } else {
      const stringifiedObj = Object.entries(data).flatMap(([key, value]) => {
        const stringifiedValue = dataToMetaArray(
          value,
          indentation,
          depth + indentation,
          wrapObjValue(depth + indentation)
        );
        return [wrapObjKey(key, depth + indentation), ...stringifiedValue];
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
