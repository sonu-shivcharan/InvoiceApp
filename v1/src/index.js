import Table from './Table.js';
import serializeTable from './serializeTable.js';
import deserializeTable from './deserializeTable.js';

const selectElem = (elem) => document.querySelector(elem);
const createElem = (tagname) => document.createElement(tagname);
const tableDetailsForm = selectElem("#table-details-form");
const editor = selectElem("#editor");
const preview = selectElem("#preview");


let closebtn;
const previewInEditor = createElem("div");
previewInEditor.id = "table-editor"
let tables = [];
window.onload = () => {
  const date = document.getElementById("date");
  date.innerHTML = `Date : ${new Date().toLocaleString().slice(0, 10)}`;
  const prevTable = localStorage.getItem("table");
  if (prevTable) {
    tables[0] = deserializeTable(prevTable);
    renderEditorTable(tables[0])
  }

}

const overlay = selectElem("#overlay");
function openTableDetails() {
  overlay.style.display = 'flex';
  editor.appendChild(overlay)
  closebtn = selectElem("#close-table-form-btn")
  closebtn.addEventListener("click", closeTableDetails)
}
function closeTableDetails() {
  editor.removeChild(overlay)
}

function handleTableFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const type = form.querySelector("select").value;
  const [name,
    colCount] = form.querySelectorAll("input");
  console.log(name, colCount);
  const newTable = new Table(type, name.value, colCount.value);
  form.reset();
  tables.push(newTable)
  closeTableDetails();
  getDataTypesForCols(newTable);
}

//prompting for column name and its data type
function getDataTypesForCols(newTable) {
  const dataTypes = ["Number",
    "String",
    "Character"];
  const form = createElem('form');
  for (let i = 0; i < newTable.colCount; i++) {
    const container = createElem("div");
    const dataTypeSelect = createElem("select");
    container.className = 'data'
    //creating select opt for column data type
    for (let data of dataTypes) {
      let newOption = createElem("option");
      newOption.value = data;
      newOption.innerText = data;
      dataTypeSelect.append(newOption);
    }
    container.appendChild(dataTypeSelect)
    const inputCol = createElem("input");
    inputCol.placeholder = "Colunm Name";
    container.appendChild(inputCol);
    form.appendChild(container);
  }
  const submitBtn = createElem('button');
  submitBtn.innerHTML = "Add";
  form.appendChild(submitBtn)
  editor.appendChild(form)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleColumnDataType(form, newTable);
    e.target.reset();
  })
}
//gets input values form form
function handleColumnDataType(form, currTable) {
  const selects = form.querySelectorAll("select");
  const inputs = form.querySelectorAll("input");
  for (let i = 0; i < selects.length; i++) {
    let dataType = selects[i].value;
    let name = inputs[i].value;
    currTable.addColumn(name, dataType);
  }
  renderEditorTable(currTable)
  console.log(currTable)
}
function renderEditorTable(table) {
  localStorage.setItem('table', serializeTable(table));
  console.log("entered render tables")
  const htmlTable = createElem("table");
  const tableHead = createElem("thead");
  const row = createElem("tr");
  const tableBody = createElem("tbody");
  for (let i = 0; i < table.colCount; i++) {
    const th = createElem("th");
    th.innerText = table.columns[i][0];
    row.appendChild(th);
  }
  tableHead.appendChild(row)
  htmlTable.appendChild(tableHead);
  htmlTable.appendChild(tableBody)
  const addRowBtn = createElem("button");
  addRowBtn.innerText = "Add row";
  addRowBtn.id = "add-row-btn";
  previewInEditor.appendChild(htmlTable);
  editor.appendChild(previewInEditor);
  editor.appendChild(addRowBtn);
  addRowBtn.addEventListener('click', addNewRow);
}
// creates and then adds new row to table
function addNewRow() {
  const newRow = createElem('tr');
  for (let i = 0; i < tables[0].colCount; i++) {
    let inputBox;
    if (tables[0].columns[i][1] == 'String') {
      inputBox = createElem('textarea');
    } else {
      inputBox = createElem('input');
    }
    const td = createElem("td");
    td.appendChild(inputBox);
    newRow.appendChild(td);
    //td.addEventListener('change', (e)=>{handleTableDataInput(e, tables[0])});
  }
  const saveBtn = createElem('td');
  saveBtn.innerText = "Save";
  saveBtn.addEventListener("click", (event) => {
    handleTableDataInput(event, tables[0])
  });
  newRow.appendChild(saveBtn)
  const editorTable = previewInEditor.getElementsByTagName('table')[0];
  const tableBody = editorTable.lastChild;
  tableBody.appendChild(newRow)
}
function handleTableDataInput(event, table) {
  const target = event.target;
  let row = target.parentElement;
  let cells = row.cells;
  let values = [];
  for (let i = 0; i < cells.length - 1; i++) {
    values.push(cells[i].firstChild.value);
  }
  table.addNewRow(row.rowIndex, values);
  renderTableInPreview(table);
}

function renderTableInPreview(table) {
  const {
    colCount,
    columns,
    rows
  } = table;
  const previewTable = preview.getElementsByTagName("table")[0];
  previewTable.innerHTML = ""
  const tableHead = createElem("thead");
  const newRow = createElem("tr");
  for (let i = 0; i <= colCount; i++) {
    const th = createElem("th");
    if (i == 0) {
      th.innerText = "Sr No";
      th.setAttribute("data-type", "Serial");
    } else {
      th.innerText = columns[i - 1][0];
      th.setAttribute("data-type", columns[i - 1][1]);
    }
    newRow.appendChild(th);
  }
  tableHead.appendChild(newRow);
  previewTable.appendChild(tableHead);
  previewTable.appendChild(createElem("tbody"));

  // console.log(newTable);
}


function renderTableRowsInPreview(previewTable) {
  const tableBody = previewTable.querySelector("tbody");
  tableBody.innerHTML = "";
  const tableRows = tables[0].rows;
  let numDataTypeIdx = -1;
  for (let i = 0; i < tableRows.size; i++) {
    const rowData = tableRows.get(i + 1);
    const newRow = createElem("tr");
    {
      const td = createElem("td");
      td.classList.add("text-center");
      td.innerText = `${i + 1})`;
      newRow.appendChild(td)
    }
    for (let j = 0; j < rowData.length; j++) {
      let className = ["text-center"];
      const td = createElem("td");

      const colDataType = tables[0].columns[j][1];
      td.innerText = rowData[j];
      if (colDataType == "Number") {
        className = ["text-right"];
        numDataTypeIdx = i;
        td.innerText = Number(rowData[j]).toFixed(2);
      } else if (colDataType == "String") {
        className = ["text-left"];
      }



      td.classList.add(className)
      newRow.appendChild(td);
      console.log(rowData[j])
    }
    tableBody.append(newRow)
  }
  const newRow = createElem("tr")
  for (let i = 0; i < 2; i++) {
    const td = createElem("td");
    if (i == 0) {
      td.setAttribute("colspan", tables[0].colCount);
      td.innerHTML = "Total"
    } else {
      td.innerHTML = `&#8377;${tables[0].total(numDataTypeIdx)}/-`;
    }
    td.classList.add("text-center", "font-bold")

    newRow.appendChild(td);
  }
  tableBody.appendChild(newRow)
  console.log(tableBody)
  localStorage.setItem("table", serializeTable(tables[0]))
}

const editorBtn = selectElem("#editor-btn");
const previewBtn = selectElem("#preview-btn");
previewBtn.addEventListener("click", () => {
  displayElement(preview, editor);
  const header = document.getElementById("header");
  const firstSection = document.getElementById("first-section");
  firstSection.style.marginTop = header.clientHeight - 20 + "px";

  const previewTable = preview.getElementsByTagName("table")[0];
  renderTableRowsInPreview(previewTable);
});
editorBtn.addEventListener("click", () => {
  displayElement(editor, preview);
});
function displayElement(elemToDisplay, elemToHide) {
  elemToDisplay.style.display = "block";
  elemToHide.style.display = "none";
}

selectElem("#add-tbl-btn").addEventListener("click", openTableDetails);
tableDetailsForm.addEventListener("submit", handleTableFormSubmit)