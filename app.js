const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_+={[]}|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

// show and update password length to the UI
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  // or kuch bhi hoga..!
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize;
}

// Set color of indicator according to PAssword Strength...!
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Get random Integer from a min value to max value..!
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Get a random number b/w 1 - 9..!
function generateNumbers() {
  return getRndInteger(0, 9);
}

// get a random uppercase Character b/w A - Z
function generateLowercase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

// get a random lowercase Character b/w a - z
function generateUppercase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

// get a random Symbol from the given string of symbols
function generateSymbols() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

// Function to check password Strength...!
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numberCheck.checked) hasNumber = true;
  if (symbolCheck.checked) hasSymbol = true;

  if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

// function to copy content on the clipBoard...!
async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  //   to make copy wala msg visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

// Function to shuffle the generated password..!
function shufflePassword(shufflePassword) {
  // Fisher Yate's Method -> An algo to shuffle something...!
  for (let i = shufflePassword.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shufflePassword[i];
    shufflePassword[i] = shufflePassword[j];
    shufflePassword[j] = temp;
  }
  let str = " ";
  shufflePassword.forEach((el) => (str += el));
  return str;
}

// function to handle checkBoxes...!
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;

    //   special Condition...!
    if (passwordLength < checkCount) {
      passwordLength = checkCount;
      handleSlider();
    }
  });
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

// EventListner to update password length acco to inputSlider in UI...!
inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

// EventListener to add event on copu btn...!
copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

// eventListener to Generate password in UI (main Function)...!
generateBtn.addEventListener("click", () => {
  // if none of the checkbox is selected ...!
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // let's generate the new password...!
  password = "";

  //   if (uppercaseCheck.checked) {
  //     password += generateUppercase();
  //   }

  //   if (lowercaseCheck.checked) {
  //     password += generateLowercase();
  //   }

  //   if (numberCheck.checked) {
  //     password += generateNumbers();
  //   }

  //   if (symbolCheck.checked) {
  //     password += generateSymbols();
  //   }

  let funcArr = [];

  if (uppercaseCheck.checked) funcArr.push(generateUppercase);

  if (lowercaseCheck.checked) funcArr.push(generateLowercase);

  if (numberCheck.checked) funcArr.push(generateNumbers);

  if (symbolCheck.checked) funcArr.push(generateSymbols);

  // compulsory Addition..!
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  // remaining Addition...!
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  // Shuffling the password...!
  password = shufflePassword(Array.from(password));

  // Show in UI..!
  passwordDisplay.value = password;

  // Calculate Strength..!
  calcStrength();
});
