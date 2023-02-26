const fieldWidth = "240px";
const fieldHeight = "117px";
const imageWidth = "auto";
const imageHeight = "auto";

const sqInput = document.getElementById("my-input");
const setNum = document.querySelector('.set-num');
const setButton = document.querySelector('.set-btn');
const grid = document.querySelector(".grid");
const resetButton = document.getElementById('reset-button');
const reset = document.getElementById('reset');
const sizeLabel = document.getElementById('size-label');
const isZero = (currentValue) => currentValue === 0;

let fields;
let fieldsArr;
let isMarkedElement = false;
let markedField = false;
let length = sqInput.value;
let gridSize;
let rowBorders = [];
let sq;
let board = [];
let graph = {};
var addedGridCells = [];



grid.style.gridTemplateColumns = `repeat(${length}, 1fr)`;
grid.style.gridTemplateRows = `repeat(${length}, 1fr)`;

sqInput.addEventListener('change', (e) => {
  length = e.target.value;
  grid.style.gridTemplateColumns = `repeat(${length}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${length}, 1fr)`;

  if(length > 2 && length < 11)
  {sizeLabel.innerHTML = `The size of grid: ${e.target.value}x${e.target.value}`}
  else
  {sizeLabel.innerHTML = `Set the size of grid`}

  if(length > 2 && length < 11){
  setButton.removeAttribute('disabled');
  }
  else{
    setButton.setAttribute('disabled', 'disabled')
  }
});

setButton.addEventListener('click', ()=> {
  gridSize = parseInt(length)
  sq = gridSize * gridSize;
  console.log(gridSize)

  for (let i = 0; i < sq; i++) {
    let div = document.createElement("div");
    div.classList.add("grid-cell");
    div.dataset.row = Math.floor(i / length) + 1;
    div.dataset.col = (i % length) + 1;
    div.dataset.id = `${i}`;
    grid.appendChild(div);
    board[i] = 0;
  }
  let marker = gridSize - 1;
  for (let i = 0; i < sq; i++) {
    if (i % gridSize == marker || i % gridSize === 0) {
      rowBorders.push(i);
    }
  }
  fields = document.querySelectorAll(".grid-cell");
  fieldsArr = Array.from(fields);
  startGame();
  setNum.style.display = 'none';
  reset.style.display = 'block';
  grid.style.display = 'grid';

  click();
  setTarget();
})


resetButton.addEventListener('click', () => {
    rowBorders = [];
    graph = {};
    addedGridCells = [];
    isMarkedElement = false;
    markedField = false;
    fields.forEach((cell, index) => {
    cell.classList.remove('mark', 'green', 'not-available-move', 'has-child');
    cell.innerHTML = '';
    board[index] = 0;
  });
  addRandomElements(5)
});


function addRandomElements(items){
  for (var i = 0; i < items; i++) {
    var randomIndex = getRandomNumber(0, fields.length - 1);
    while (board[randomIndex]!== 0) {
      randomIndex = getRandomNumber(0, fields.length - 1)
    }
    var randomGridCell = fields[randomIndex];
    var childElement = document.createElement("img");
    childElement.src = "images/monster.png";
    childElement.style.width = imageWidth;
    childElement.style.height = imageHeight;
    randomGridCell.appendChild(childElement);
    randomGridCell.classList.add("has-child");
    addedGridCells.push(randomIndex);
    board[randomIndex] = 1;
  }
  makeGraph()
  addedGridCells = []
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function startGame() {
  // addElementsOnStart
  addRandomElements(5)
}

function addImg(el) {
  var img = document.createElement("img");
  img.src = "images/monster.png";
  img.style.width = imageWidth;
  img.style.height = imageHeight;
  img.style.opacity = 0;
  el.appendChild(img);
  el.classList.add("has-child");
 setTimeout(()=> img.style.opacity = 1, 100) 
  ;
}

function removeImg(el) {
  el.removeChild(el.firstChild);
  el.classList.remove("mark");
}

function clearFields(el){
    el.removeChild(el.firstChild);
    el.classList.remove('has-child');
    board[el.dataset.id] = 0;
}

function click() {
let flag = false;
if(fields){
  fields.forEach((el, index) =>
    el.addEventListener("click", (e) => {
        if(flag) return;
        flag = true;
      if (!isMarkedElement) {
            if(el.hasChildNodes()){
          el.classList.add("mark");
          board[index] = 0;
          isMarkedElement = true;
          checkNeighbours(index);
        }
      }
      flag = false;

    })
  );
}
}

function setTarget() {
    let flag = false;
    fieldsArr.forEach((el, id) =>
    el.addEventListener("click", () => {
        if(flag) return;
        flag = true;
      if (
        !el.classList.contains("mark") &&
        !el.classList.contains("has-child") &&
        isMarkedElement
      ) {
        el.classList.add("green");
        markedField = true;
        let moved = go();
        if(moved){
            let ziom = checkRows(board);
            if(!ziom){
              console.log(ziom)
              setTimeout(addRandomElements(1), 1000)
              }
              else{
                setTimeout(() => { 
                  if(board.every(isZero)) { 
                    alert("No more moves"); 
                    grid.style.display = 'none';
                    while (grid.firstChild) {
                      grid.removeChild(grid.lastChild);
                    }
                    reset.style.display = 'none';
                    setNum.style.display = 'flex';
                  } 
                }, 0)
                
              }
          }
      }
      flag = false;
    })
  );
}

function checkRows(arr) {
  let helperArr = []

  for (let i = 0; i < arr.length - 2; i++) {
    if (i <= arr.length - gridSize + 2 && arr[i] === 1 && arr[i + 1] === 1 && arr[i + 2] === 1) {
      if(gridSize >= 5){
      if( arr[i + 3] === 1 && arr[i + 4] === 1 && i % gridSize < gridSize - 4){
        console.log('jestem w piatce');
        clearFields(fieldsArr[i]);
        clearFields(fieldsArr[i + 1]);
        clearFields(fieldsArr[i + 2]);
        clearFields(fieldsArr[i + 3]);
        clearFields(fieldsArr[i + 4]);
        return true;   
      }
      if(arr[i + 3] === 1 && i % gridSize < gridSize - 3){
        console.log('czworka w piatce');
        clearFields(fieldsArr[i]);
        clearFields(fieldsArr[i + 1]);
        clearFields(fieldsArr[i + 2]);
        clearFields(fieldsArr[i + 3]);
        return true;
      }
      if(arr[i+2] === 1 && i % gridSize < gridSize - 2)
      {
        clearFields(fieldsArr[i]);
        clearFields(fieldsArr[i + 1]);
        clearFields(fieldsArr[i + 2]);
        return true;
      }
    }
      if(gridSize === 4)
      {
        if (arr[i + 3] === 1 && i % gridSize == 0){
        console.log('czworka');
        clearFields(fieldsArr[i]);
        clearFields(fieldsArr[i + 1]);
        clearFields(fieldsArr[i + 2]);
        clearFields(fieldsArr[i + 3]);
          return true;
        }
        if(arr[i+2] === 1 && i % gridSize < gridSize - 2){
          console.log('===============')
          clearFields(fieldsArr[i]);
          clearFields(fieldsArr[i + 1]);
          clearFields(fieldsArr[i + 2]);
          return true;
        }
      }
      if(gridSize == 3 && i % gridSize == 0){
          clearFields(fieldsArr[i]);
          clearFields(fieldsArr[i + 1]);
          clearFields(fieldsArr[i + 2]);
          return true;
      }
    }
  }
  return false;
}

function go() {
  let start,
    end,
    bool = false;
  if (document.querySelector(".mark")) {
    start = document.querySelector(".mark");
  }

  if (document.querySelector(".green")) {
    end = document.querySelector(".green");
  } 
  else {
    if(!start)
    return false;
    else{
    start.classList.remove("mark");
    }
  }

  if (start) {
    if (end) {
      bool = breadthFirstSearch(makeGraph(), start.dataset.id, end.dataset.id);
      if (bool) {
        addImg(end);
        removeImg(start);
        setTimeout(() => {
            end.classList.remove("green");
          }, 500);
        start.classList.remove("mark");
        start.classList.remove("has-child");
        board[end.dataset.id] = 1;
        console.log(board);
        makeGraph();
        isMarkedElement = false;
        markedField = false;
        return true;
      } else {
        end.classList.remove("green");
        end.classList.add("not-available-move");
        start.classList.remove("mark");

        setTimeout(() => {
          end.classList.remove("not-available-move");
        }, 500);
        isMarkedElement = false;
        markedField = false;
        return false;
      }
    }
  }
  else {
    return false;
  }
}

function checkNeighbors(index, offsets) {
  console.log(index);
  console.log(offsets);
  let bool = 0;
  offsets.forEach((offset) => {
    if (fieldsArr[index + offset].classList.contains("has-child")) {
      console.log(`Neighbor at offset ${offset} has a child`);
      bool = 1;
    } else {
      console.log(`Neighbor at offset ${offset} doesn't have a child`);
    }
  });
  return bool;
}

function checkNeighbours(index) {
  let helperArr = Array.from({length: gridSize - 2}, (_, index) => index + 1);
  console.log(`helper Arr: ${helperArr}`)
  if (
    (fieldsArr[index - 1]?.classList.contains("mark")) ||
    (fieldsArr[index - gridSize]?.classList.contains("mark")) ||
    (fieldsArr[index + gridSize]?.classList.contains("mark")) ||
    (fieldsArr[index + 1]?.classList.contains("mark"))
  ) {
    return;
  }

  console.log(
    `checkneighbours ismarkedelement: ${isMarkedElement}, markedField: ${markedField}`
  );
  let neighborRight;
  let neighborLeft;
  let neighborTop;
  let neighborBottom;
  let noMoves = false;
  if (index < gridSize) {
    if (index == 0) {
      neighborRight = checkNeighbors(index, [1]);
      console.log(neighborRight);
      neighborBottom = checkNeighbors(index, [gridSize]);
      if (neighborRight && neighborBottom) {
        noMoves = true;
      }
    } else if (index == gridSize - 1) {
      neighborLeft = checkNeighbors(index, [-1]);
      neighborBottom = checkNeighbors(index, [gridSize]);
      if (neighborLeft && neighborBottom) {
        noMoves = true;
      }
    } else {
      neighborLeft = checkNeighbors(index, [-1]);
      neighborBottom = checkNeighbors(index, [gridSize]);
      neighborRight = checkNeighbors(index, [1]);
      if (neighborRight && neighborBottom && neighborLeft) {
        noMoves = true;
      }
    }
  } else if (index > sq - gridSize - 1) {
    if (index == sq - gridSize) {
      neighborRight = checkNeighbors(index, [1]);
      neighborTop = checkNeighbors(index, [-gridSize]);
      if (neighborRight && neighborTop) {
        noMoves = true;
      }
    } else if (index == sq - 1) {
      neighborLeft = checkNeighbors(index, [-1]);
      neighborTop = checkNeighbors(index, [-gridSize]);
      if (neighborLeft && neighborTop) {
        noMoves = true;
      }
    } else {
      neighborRight = checkNeighbors(index, [1]);
      neighborLeft = checkNeighbors(index, [-1]);
      neighborTop = checkNeighbors(index, [-gridSize]);
      if (neighborRight && neighborTop && neighborLeft) {
        noMoves = true;
      }
    }
  } else {
    if (helperArr.includes(index % gridSize)) {
      neighborRight = checkNeighbors(index, [1]);
      neighborLeft = checkNeighbors(index, [-1]);
      neighborTop = checkNeighbors(index, [-gridSize]);
      neighborBottom = checkNeighbors(index, [gridSize]);
      if (neighborRight && neighborTop && neighborLeft && neighborBottom) {
        noMoves = true;
      }
    } else if (index % gridSize == 0) {
      neighborRight = checkNeighbors(index, [1]);
      neighborTop = checkNeighbors(index, [-gridSize]);
      neighborBottom = checkNeighbors(index, [gridSize]);
      if (neighborRight && neighborTop && neighborBottom) {
        noMoves = true;
      }
    } else {
      neighborLeft = checkNeighbors(index, [-1]);
      neighborTop = checkNeighbors(index, [-gridSize]);
      neighborBottom = checkNeighbors(index, [gridSize]);
      if (neighborTop && neighborLeft && neighborBottom) {
        noMoves = true;
      }
    }
  }
  if (noMoves) {
    if (isMarkedElement) {
      markedField = false;
      fields[index].classList.remove("mark");
      fields[index].classList.remove("green");
      fields[index].classList.add("not-available-move");
      console.log("not-abailavle move");
      setTimeout(() => {
        fields[index].classList.remove("not-available-move");
      }, 500);
      isMarkedElement = false;
    }
    
  }
}


function makeGraph() {
    for (let i = 0; i < board.length; i++) {
    graph[i] = { value: board[i], connections: [] };
    if (board[i] === 0) {
      if (i >= gridSize && board[i - gridSize] === 0) {
        graph[i].connections.push(i - gridSize);
      }
      if (i < board.length - gridSize && board[i + gridSize] === 0) {
        graph[i].connections.push(i + gridSize);
      }
      if (i % gridSize !== 0 && board[i - 1] === 0) {
        graph[i].connections.push(i - 1);
      }
      if (i % gridSize !== gridSize - 1 && board[i + 1] === 0) {
        graph[i].connections.push(i + 1);
      }
    }
  }
  console.log(graph);
  return graph;
}

function breadthFirstSearch(graph, start, end) {
  let queue = [];
  queue.push(start);
  let parents = {};
  parents[start] = null;
  while (queue.length > 0) {
    let current = queue.shift();
    if (current === end) {
      break;
    }
    for (let i = 0; i < graph[current].connections.length; i++) {
      let next = graph[current].connections[i];
      if (graph[next].value === 0 && !parents.hasOwnProperty(next)) {
        queue.push(next);
        parents[next] = current;
      }
    }
  }
  if (!parents.hasOwnProperty(end)) {
    console.log("Didn't find the path");
    return null;
  }

  let path = [];
  let current = end;
  while (current !== null) {
    path.unshift(current);
    current = parents[current];
  }
  console.log(`Path : ${path}`);
  return path;
}



// function resetGame() {
//   const gridCells = document.querySelectorAll('.grid-cell');
//   gridCells.forEach((cell) => {
//     cell.classList.remove('mark', 'green', 'not-available-move', 'has-child');
//     cell.innerHTML = '';
//   });
//   board = [];
//   rowBorders = [];
//   graph = {};
//   addedGridCells = [];
//   isMarkedElement = false;
//   markedField = false;
// }