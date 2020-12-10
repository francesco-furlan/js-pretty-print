const formatValue = (value, hasNext, isNextClosingSymbol) => {
  const comma = isNextClosingSymbol ? "" : ",";
  const newLine = hasNext ? "\n" : "";
  const formattedValue = typeof value === "string" ? `"${value}"` : value;
  return `${formattedValue}${comma}${newLine}`;
};

module.exports = { formatValue };
