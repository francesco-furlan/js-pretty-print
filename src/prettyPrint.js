const { dataToMetaArray } = require("./dataToMetaArray");

const prettyPrint = (data, indentation = 2) => {
  const result = dataToMetaArray(data, indentation);
  const formatted = result.reduce(
    (
      prev,
      { depth, value, isOpenSymbol, isCloseSymbol, isObjKey, isObjValue },
      index,
      originalArray
    ) => {
      const prevItem = originalArray[index - 1];
      const nextItem = originalArray[index + 1];
      const prevItemIsOpenSymbol = prevItem ? prevItem.isOpenSymbol : false;
      const nextItemIsCloseSymbol = nextItem ? nextItem.isCloseSymbol : false;
      const prevItemIsCloseSymbol = prevItem ? prevItem.isCloseSymbol : false;
      const prevItemIsObjKey = prevItem ? prevItem.isObjKey : false;

      const spaces =
        (isOpenSymbol &&
          !prevItemIsOpenSymbol &&
          !prevItemIsCloseSymbol &&
          !nextItemIsCloseSymbol) ||
        (isCloseSymbol && prevItemIsOpenSymbol) ||
        prevItemIsObjKey
          ? ""
          : new Array(depth).fill(" ").join("");

      const formattedValue =
        typeof value === "string" && !(isOpenSymbol || isCloseSymbol)
          ? `"${value}"`
          : value;

      const colon = isObjKey ? ": " : "";

      const comma =
        !isObjKey && nextItem && !isOpenSymbol && !nextItem.isCloseSymbol
          ? ","
          : "";

      const newLine =
        isObjKey || !nextItem || (isOpenSymbol && nextItemIsCloseSymbol)
          ? ""
          : "\n";

      return `${prev}${spaces}${formattedValue}${colon}${comma}${newLine}`;
    },
    ""
  );

  return formatted;
};

module.exports = {
  prettyPrint,
};
