function serializeTable(table) {
  return JSON.stringify({
    type: table.type,
    name: table.name,
    colCount: table.colCount,
    columns: table.columns,
    rows: Array.from(table.rows.entries()),
    totalAmount : Number(table.totalAmount).toFixed(2)
  });
}

export default serializeTable;



