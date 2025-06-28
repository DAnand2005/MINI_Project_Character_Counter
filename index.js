const input = document.getElementById("inputText");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const sentCount = document.getElementById("sentCount");
const density = document.getElementById("letterDensity");
const excludeSpaces = document.getElementById("excludeSpaces");

input.addEventListener("input", update);
excludeSpaces.addEventListener("change", update);

const setLimitCheckbox = document.getElementById("setLimit");
let charLimit = null;

const container = document.querySelector(".container");

const dialogBox = document.createElement("div");
dialogBox.classList.add("dialog-box");
dialogBox.style.display = "none";
dialogBox.innerHTML = `
    <div class="dialog-content">
        <label for="charLimitInput">Enter the maximum number of characters:</label>
        <input type="number" id="charLimitInput" min="1" />
        <div class="dialog-buttons">
            <button id="setLimitButton">Set Limit</button>
            <button id="cancelButton">Cancel</button>
        </div>
    </div>
    <style>
        .dialog-box {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            border: 2px solid #0078d4;
            border-radius: 10px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.15);
            padding: 32px 28px 24px 28px;
            z-index: 1000;
            min-width: 320px;
            max-width: 90vw;
        }
        .dialog-content {
            display: flex;
            flex-direction: column;
            gap: 18px;
            align-items: stretch;
        }
        .dialog-content label {
            font-weight: 500;
            color: #222;
            margin-bottom: 4px;
        }
        #charLimitInput {
            padding: 8px;
            font-size: 1rem;
            border: 1px solid #bdbdbd;
            border-radius: 5px;
            width: 100%;
            box-sizing: border-box;
        }
        .dialog-buttons {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 10px;
        }
        #setLimitButton, #cancelButton {
            padding: 7px 18px;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.2s;
        }
        #setLimitButton {
            background: #0078d4;
            color: #fff;
        }
        #setLimitButton:hover {
            background: #005fa3;
        }
        #cancelButton {
            background: #e0e0e0;
            color: #333;
        }
        #cancelButton:hover {
            background: #bdbdbd;
        }
    </style>
`;
container.appendChild(dialogBox);

setLimitCheckbox.addEventListener("change", () => {
  if (setLimitCheckbox.checked) {
    dialogBox.style.display = "block";
  } else {
    charLimit = null;
    dialogBox.style.display = "none";
  }
});

document.getElementById("setLimitButton").addEventListener("click", () => {
  const charLimitInput = document.getElementById("charLimitInput").value;
  charLimit = parseInt(charLimitInput, 10);

  if (isNaN(charLimit) || charLimit <= 0) {
    alert("Please enter a valid positive number.");
    setLimitCheckbox.checked = false;
    charLimit = null;
  } else {
    dialogBox.style.display = "none";
  }
});

document.getElementById("cancelButton").addEventListener("click", () => {
  setLimitCheckbox.checked = false;
  charLimit = null;
  dialogBox.style.display = "none";
});

function update() {
  let text = input.value;


  if (charLimit !== null && text.length > charLimit) {
    text = text.slice(0, charLimit);
    input.value = text;
  }
  let sentenceCount = (text.match(/[.!?]/g) || []).length;
  if(sentenceCount > 5){
    read = document.getElementById("readingTime");

    let val = Math.ceil(sentenceCount / 5);
    read.textContent = ` Approx Reading time: < ${val} minutes`;
  }
  else{
    read = document.getElementById("readingTime");
    read.textContent = " Approx Reading time: < 1 minute";
  }


  let chars = excludeSpaces.checked ? text.replace(/\s/g, "") : text;
  charCount.textContent = chars.length;
  wordCount.textContent = (text.trim().match(/\b\w+\b/g) || []).length;
  sentCount.textContent = (text.match(/[.!?]/g) || []).length;

  let freq = {};
  for (let ch of text.toUpperCase()) {
    if(ch != " ")
    freq[ch] = (freq[ch] || 0) + 1;
  }

  const total = Object.values(freq).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);

const topDensity = sorted.map(([l, c]) => {
    const percent = ((c / total) * 100).toFixed(2);
    return `<div>${l} (${c}) (${percent}) <div class='bar' style='width:${percent}%'></div></div>`;
}).join("");

//   const allDensity = sorted.map(([l, c]) => {
//     const percent = ((c / total) * 100).toFixed(2);
//     return `<div>${l} (${c}) <div class='bar' style='width:${percent}%'></div></div>`;
//   }).join("");

  density.innerHTML = topDensity;
}