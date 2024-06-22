import Table from '/src/table.js'
function deserializeTable(jsonString) {
  const obj = JSON.parse(jsonString);
  const table = new Table(obj.type, obj.name, obj.colCount);
  table.columns = obj.columns;
  table.rows = new Map(obj.rows);
  table.totalAmount=Number(obj.totalAmount).toFixed(2);
  return table;
}
export default deserializeTable;