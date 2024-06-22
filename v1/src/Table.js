class Table {
  constructor(type, name, colCount) {
    this.type = type;
    this.name = name;
    this.colCount = colCount;
    this.columns = [];
    this.rows = new Map();
    this.totalAmount = 0;
  }
  addColumn(name, dataType) {
    this.columns.push([name, dataType]);
  }
  addNewRow(rowIdx, value) {
    this.rows.set(rowIdx, value);
    this.setTotal(value[value.length - 1]);
  }
  total(colIdx) {
    console.log(this.rows.get(1)[colIdx]);
    let total = 0;
    for (let i = 0; i < this.rows.size; i++) {
      total += Number(this.rows.get(i + 1)[this.colCount - 1]);
    }
    return total.toFixed(2);
  }
  setTotal(totalAmount) {
    this.totalAmount = Number(totalAmount).toFixed(2);
  }
  getTotalAmountInWords() {
    const inWords = []
    const inFigures = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 30, 40, 50, 60, 70, 80, 90, 100, 1000]
  }
}
export default Table;