const inputSlider = document.querySelector("[data-lengthslider]");
const lenghtDisplay = document.querySelector("[data-length]");
const copyBtn = document.querySelector("[data-copy]");
const passwordDisplay = document.querySelector("[data-passwoed-display]");
const copyMsg = document.querySelector("[data-copied]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~!@#$%^&*()_-+={[}]\|;:',<.>?/";

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

//set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lenghtDisplay.innerText = passwordLength;
    const min =inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength-min)*100/(max-min))+"% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shawdow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNum(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperrCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    let sym = getRndInteger(0,symbols.length);
    return symbols.charAt(sym);
}

function calcStrngth(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbols = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSymbols = true;

    if(hasUpper && hasLower && (hasNum|| hasSymbols) && passwordLength >=8){
        setIndicator("#0f0");
    }
    else if((hasLower||hasUpper) && (hasNum || hasSymbols) && passwordLength >=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f08");
    }
}

function shufflePassword(array){
    for(let i=array.length-1;i>0;i--){
        const j= Math.floor(Math.random()*(i+1));
        const temp =array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str ="";
    array.forEach((el) => (str+=el));
    return str;
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
    
}

function handleCheckBoxChange(){
    checkCount =0;
    allCheckBox.forEach( (checkBox)=>{
        if(checkBox.checked){
            checkCount++;
        }
    });

    if(passwordLength< checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',(e)=>{
    if(passwordDisplay.value)
        copyContent();
})

generateButton.addEventListener('click',()=>{
    if(checkCount <=0){
        return;
    }
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";
    // if(uppercaseCheck.checked){
    //     password += generateUpperrCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNum();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperrCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNum);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }

    for(let i=0; i< passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0,funcArr.length);
        
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;
    calcStrngth();
})