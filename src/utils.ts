const BASE_URL = (pageNumber: number) => `https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84&page=${pageNumber}`;
const tBody = document.querySelector('[data-sink="tableBody"]');
interface IRow {
  id: string;
  row: number;
  age: number;
  gender: string;
}
interface IRows extends Array<IRow> {}

export const getData = async (currentPageNumber: number) => {
  try {
    const res = await fetch(BASE_URL(currentPageNumber));
    const data = await res.json();
    // console.log("res is", data);
    return data;
  } catch (err) {
    alert(err?.message || err?.response?.data?.message);
    throw new Error(err);
  }
};

export const populateTable = (tableData: IRows) => {
  // clear the current table data
  tBody?.replaceChildren("");

  // iterate over the tableData
  tableData?.forEach((data) => {
    const trow = document.createElement("tr");
    trow.setAttribute("data-entryid", data.id);

    const tColumn1 = document.createElement("td");
    const tColumn2 = document.createElement("td");
    const tColumn3 = document.createElement("td");

    const firstCol = document.createTextNode(data.row.toString());
    const secondCol = document.createTextNode(data.gender);
    const thirdCol = document.createTextNode(data.age.toString());

    tColumn1.appendChild(firstCol);
    tColumn2.appendChild(secondCol);
    tColumn3.appendChild(thirdCol);

    trow.appendChild(tColumn1);
    trow.appendChild(tColumn2);
    trow.appendChild(tColumn3);

    tBody?.append(trow);
  });
}