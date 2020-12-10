const dataToMetaArray = (data) => {
  if (typeof data === "object") {
    let result = [];
    if (Array.isArray(data)) {
      const mappedArr = data.flatMap((value) => dataToMetaArray(value));
      return [...result, "[", ...mappedArr, "]"];
    } else {
      const stringifiedObj = Object.entries(data).flatMap(([key, value]) => {
        const stringifiedValue = dataToMetaArray(value);
        return [key, ...stringifiedValue];
      });
      return [...result, "{", ...stringifiedObj, "}"];
    }
  } else {
    return [data];
  }
};

module.exports = {
  dataToMetaArray,
};
