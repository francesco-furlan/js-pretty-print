const formatValue = (value, hasNext, isNextClosing) => {
  const comma = isNextClosing ? "" : ",";
  const newLine = hasNext ? "\n" : "";
  const formattedValue = typeof value === "string" ? `"${value}"` : value;
  return `${formattedValue}${comma}${newLine}`;
};

module.exports = { formatValue };
