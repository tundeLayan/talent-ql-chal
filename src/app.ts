import { getData, populateTable } from "./utils";

const pageViewLabel = document.querySelector(
  '[data-pageview="page-view"]'
) as HTMLLabelElement;
const nextBtn = document.querySelector('[data-nextbtn="nextBtn"]') as HTMLButtonElement;
const prevBtn = document.querySelector('[data-prevbtn="prevBtn"]') as HTMLButtonElement;

let currentPageNumber = 1;
// we need this arrayIndex value to track array index position
let arrayIndex = 1;
let response;

const setPageIndex = (page?: number) => {
  pageViewLabel?.replaceChildren("");
  if (page) {
    const currentPageText = document.createTextNode(`Showing Page ${currentPageNumber}`);
    pageViewLabel?.appendChild(currentPageText);
  }
}

const handleNextClick = async () => {
  // setPageIndex();
  toggleLoader();
  // currentPageNumber+=1;
  enableBtn(prevBtn);
  // using just this was not enough to track array index
  currentPageNumber += 1;

  // TODO: check if next exists
  if (arrayIndex % 2 === 1) {
    arrayIndex += 1;
    populateTable(response?.results[0][arrayIndex]);
  } else {
    // make the call
    arrayIndex += 1;
    response = await getData(arrayIndex);
    populateTable(response?.results[0][arrayIndex]);
  }
  toggleLoader(currentPageNumber);
  // setPageIndex(currentPageNumber);
}

const handlePrevClick = async () => {
  // setPageIndex();
  toggleLoader();
  currentPageNumber -= 1;
  // if current page is 1, disable prev button
  currentPageNumber === 1 && disableBtn(prevBtn);
  // if current page is odd, make api call
  if (arrayIndex%2 === 1) {
    arrayIndex -= 1;
    response = await getData(arrayIndex - 1);
    populateTable(response?.results[0][arrayIndex]);
  } else {
    arrayIndex -= 1;
    populateTable(response?.results[0][arrayIndex]);
  }
  toggleLoader(currentPageNumber);
  // setPageIndex(currentPageNumber);
}

export function toggleLoader(page?: number) {
  pageViewLabel?.replaceChildren("");
  if (!page) {
    const div = document.createElement("div");
    div.setAttribute("class", "lds-dual-ring");
    pageViewLabel?.appendChild(div);
    return;
  }
  const pageText = document.createTextNode(`Showing Page ${page}`);
  pageViewLabel?.appendChild(pageText);
}

const disableBtn = (btn) => {
  btn?.setAttribute("disabled", "disabled");
}

const enableBtn = (btn) => {
  btn?.removeAttribute("disabled");
}

nextBtn?.addEventListener("click", handleNextClick);
prevBtn?.addEventListener("click", handlePrevClick);

const startApp = async () => {
  //disable both prev and next buttons until data is loaded
  toggleLoader();
  disableBtn(nextBtn);
  disableBtn(prevBtn);

  response = await getData(currentPageNumber);
  // setPageIndex(currentPageNumber);
  // if there is next, enable next button
  if (response?.results[0].paging.next) {
    enableBtn(nextBtn);
  }
  toggleLoader(currentPageNumber);

  // populate table
  populateTable(response?.results[0][currentPageNumber]);
};

document.addEventListener("DOMContentLoaded", startApp);