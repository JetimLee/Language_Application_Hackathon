//Gavin code for front end authorization starts here, checking for JWT
window.addEventListener("load", (event) => {
  if (sessionStorage.getItem("myapp_token") === null) {
    // alert(`it appears you're not logged in, routing you to login`);
    window.open("./login.html", "_self");
    console.log(`there ain't no token here`);
  }
  if (sessionStorage.getItem("myapp_token") !== null) {
    // alert(`welcome to the app!`);
    // console.log(`i found a token!`);
  }
});


let thisUser = sessionStorage.myapp_token;
localStorage.setItem("userID", thisUser);
// console.log(localStorage);
// console.log(`this is the user id ${thisUser}`);


//Josh Code


// let languageWords = [
//   {word_id:1,language_id:"fr",word:"un",translation:"one",part_of_speech:"number"},
//   {word_id:2,language_id:"fr",word:"deux",translation:"two",part_of_speech:"number"},
//   {word_id:3,language_id:"fr",word:"trois",translation:"three",part_of_speech:"number"},
//   {word_id:4,language_id:"fr",word:"chien",translation:"dog",part_of_speech:"noun"},
//   {word_id:5,language_id:"fr",word:"chat",translation:"cat",part_of_speech:"noun"},
//   {word_id:6,language_id:"es",word:"uno",translation:"one",part_of_speech:"number"}
//   ];

let languages = [];

// let userWords =[
// {user_id:1622209304362,language_id:"fr",word_id:1,times_right:0,times_wrong:0},
// {user_id:1622209304362,language_id:"fr",word_id:2,times_right:1,times_wrong:0},
// {user_id:1622209304362,language_id:"es",word_id:6,times_right:0,times_wrong:0},
// {user_id:1622209304362,language_id:"fr",word_id:1,times_right:0,times_wrong:0},
// {user_id:1622209304362,language_id:"fr",word_id:2,times_right:1,times_wrong:0},

// {user_id:2,language_id:"fr",word_id:3,times_right:0,times_wrong:0}
// ];

let myLanguages = document.getElementById("myLanguages");
let newLanguages = document.getElementById("newLanguages");

let navAddVocab = document.getElementById("navAddVocab");
let navQuiz = document.getElementById("navQuiz");
let navMyVocab = document.getElementById("navMyVocab");
let root = document.getElementById("root");

let topSec;
let cards;
let actions;
let answerInput;
let newVocabInputs;
let addWords;

let userWordsArray;

// let thisUser = 1;
let sessionWords;
// let quizzedWords = [];
// let finishedCards = 0;
let correctCards = 0;
let currentCard = {word_id:null};
let inputCount = 0;
let quizCounter = 0;
let quizLength;

let userLanguagesIds;
let otherLanguagesIds;
let allLanguagesIds;
let currentLanguage;

// if currentLanguage is written RTL, this will be set to rtl and inserted as class, for proper text alignment
let rtl = "";
let rtlLanguages = ["ar","fa","he","ur","yi"];


const urlBase = "https://translate.yandex.net/api/v1.5/tr.json";
const key =
  "trnsl.1.1.20210528T084434Z.4d3133de06fa8f3a.5cfcaf3ee6f0eab20cf8b03db9e9d3851bf5abdd";


let activeSection;

const navToAddVocab = () => {
  if (activeSection !== "navAddVocab") {
    addVocabScreen();
  }
}

const navToQuiz = () => {
  if (activeSection !== "navQuiz") {
    setupQuiz();
  }
}

const navToMyVocab = () => {
  if (activeSection !== "myVocab") {
    myVocabScreen();
  }
}

navAddVocab.addEventListener("click",navToAddVocab);
navQuiz.addEventListener("click",navToQuiz);
navMyVocab.addEventListener("click",navToMyVocab);



const myVocabScreen = () => {
  console.log(document.getElementById("answerInput"));

  activeSection = "myVocab";
   if (!navMyVocab.classList.contains("active")) {
    navMyVocab.classList.toggle("active");
  };
    navAddVocab.classList.remove("active");
    navQuiz.classList.remove("active");
  if (!currentLanguage) {
    root.innerHTML = "<div><p>Please select a language to start</p></div>";
    return;
  }
 if (!userWordsArray) {
    root.innerHTML = "<div><p>You haven't yet added any words for this language. Add some to start!</p></div>";
    return;
  };
  root.innerHTML = "";
  let myVocab = document.createElement("div");
  myVocab.id = "myVocab";
  myVocab.insertAdjacentHTML("beforeend",`<h3>${getLanguageName(currentLanguage)}</h3><h3>English</h3>`);
  let thisUserWords = userWords.filter(a => a.user_id == thisUser && a.language_id == currentLanguage);
  for (item of thisUserWords) {
    // console.log(item);
    let wordItem = languageWords.filter(a => a.word_id === item.word_id);
  // console.log(wordItem);
    // console.log(a);
    let content = `<div class="targetLanguage${rtl}">${wordItem[0].word}</div><div class="sourceLanguage">${wordItem[0].translation}</div>`
    myVocab.insertAdjacentHTML("beforeend",content);
  }
  root.appendChild(myVocab);

}


const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const setCurrentLanguage = (id) => {
  currentLanguage = id;
  if (rtlLanguages.includes(currentLanguage)) {
    rtl = " rtl";
  }
};

const selectLanguage = (event) => {
  if (isNaN(event.target.value)) {
    setCurrentLanguage(event.target.value);
    // if user chooses language already learning, or new one
    root.classList.toggle("startScreen");
    if (event.target.id == "myLanguagesSelect") {
      document.getElementById("newLanguagesSelect").value="0";
      setupQuiz();
    } else {
      document.getElementById("myLanguagesSelect").value="0";
      addVocabScreen();
    }
  }
};

const addVocabScreen = () => {
  activeSection = "newVocab";
  root.classList.toggle("addVocabScreen");
   if (!navAddVocab.classList.contains("active")) {
    navAddVocab.classList.toggle("active");
  };
    navMyVocab.classList.remove("active");
    navQuiz.classList.remove("active");
  if (!currentLanguage) {
    root.innerHTML = "<div><p>Please select a language to start</p></div>";
    return;
  }
  if (userWords.filter(a => a.user_id == thisUser && a.language_id == currentLanguage) == "") {
    userWordsArray = [];
  }

  root.innerHTML = `
  <div id="topSec"><p>Enter up to ten new words or phrases you want to study:</p></div`;
  let div = document.createElement("div");
  div.id = "newVocabInputs";
  newVocabInputs = div;
  newVocabInputs.insertAdjacentHTML("beforeend",`<h3>English</h3><h3>${getLanguageName(currentLanguage)}</h3><div></div>`);
  appendInput();
  root.appendChild(newVocabInputs);
  root.insertAdjacentHTML("beforeend",`
    <div id="actions">
      <button id="addWords">Add words</button>
    </div>`);
  addWords = document.getElementById("addWords");
  addWords.addEventListener("click",addWordsToDBs);
};

const submitWord = (event) => {
  if (event.key === "Enter" && event.target.value !== "") {
    inputCount++;
    changeInputToString(event.target,true);
    getTranslation(event.target.value);
  }
};

const appendInput = () => {
  let div = document.createElement("div");
  div.classList.add("sourceLanguage");
  let input = document.createElement("input");
  input.addEventListener("keyup",submitWord);
  input.setAttribute("maxlength","100")
  div.appendChild(input);
  setTimeout(() => input.focus(),5);
  newVocabInputs.appendChild(div);
};

// https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20210528T084434Z.4d3133de06fa8f3a.5cfcaf3ee6f0eab20cf8b03db9e9d3851bf5abdd&ui=en-af&text=one 

const fetchTranslation = async (string) => {
  let url = `${urlBase}/translate?key=${key}&lang=en-${currentLanguage}&text=${string}`;
  // Default options are marked with *
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response; // parses JSON response into native JavaScript objects
    let dataJson = await data.json();
    return dataJson.text;
  } catch (e) {
    console.log(e);
  }
};

const deleteRow = (event) => {
  event.target.parentNode.previousElementSibling.previousElementSibling.remove();
  event.target.parentNode.previousElementSibling.remove();
  event.target.parentNode.remove();
  inputCount--;
  if (inputCount===9) {
    appendInput();
  }
};

const getTranslation = async (string) => {
  let translation = await fetchTranslation(string);
  console.log(translation);
  // newVocabInputs = document.getElementById("newVocabInputs");
  newVocabInputs.insertAdjacentHTML('beforeend', `
    <div class="targetLanguage${rtl}"><span>${translation}</span></div>
    `);
  let div = document.createElement("div");
  div.classList.add("delete");
  div.innerHTML = `<button>Remove</button>`;
  div.addEventListener("click",deleteRow);
  newVocabInputs.appendChild(div);
  // console.log(inputCount);
  // inputCount = document.querySelectorAll("input").length;
  if (inputCount < 10) {
    // console.log("inputCount is less than 10");
    appendInput();
  }
};

const setupQuiz = () => {
  activeSection = "quiz";
  if (!root.classList.contains("cardScreen")) {
    root.classList.toggle("cardScreen");
  };
  if (!navQuiz.classList.contains("active")) {
    navQuiz.classList.toggle("active");
  };
    navMyVocab.classList.remove("active");
    navAddVocab.classList.remove("active");
  if (!currentLanguage) {
    root.innerHTML = "<div><p>Please select a language to start</p></div>";
    return;
  }
  if (userWordsArray == "") {
    root.innerHTML = "<div><p>You haven't yet added any words for this language. Add some to start!</p></div>";
    return;
  }
  quizCounter = 0;
  getSessionWords();
  root.innerHTML = `<div id="topSec"></div><div id="cards"></div><div id="actions"></div>`;
  topSec = document.getElementById("topSec");
  cards = document.getElementById("cards");
  actions = document.getElementById("actions");
  showNumbers();
  setCurrentCard();
};


const showLanguageList = (div, ids) => {
  let select = document.createElement("select");
  let id = (div.id == "myLanguages" ? "myLanguagesSelect" : "newLanguagesSelect");
  // console.log(div);
  // console.log(id);
  select.id = id;
  // console.log(ids);
  let subsetLanguages = languages.filter(a => ids.includes(a.language_id));
  // console.log(subsetLanguages);
  let option = document.createElement("option");
    option.value = 0;
    option.textContent = "Select one";
    select.appendChild(option);
  for (let item of subsetLanguages) {
    let option = document.createElement("option");
    option.setAttribute("value",item.language_id);
    option.textContent = capitalize(item.language_name); 
    select.appendChild(option);
  }
  select.addEventListener("change",selectLanguage);
  // console.log(select);
  div.appendChild(select);
};




let getSessionWords = () => {
  // console.log(userWords);
  let thisUserWords = userWords.filter(a => a.user_id == thisUser && a.language_id == currentLanguage);
  quizLength = thisUserWords.length > 10 ? 40 : 15;
  let array = [];
  for (word of thisUserWords) {
    let score = (word.times_right-word.times_wrong > -1) ? word.times_right-word.times_wrong : 0;
    let value = Math.ceil(20/(score+1));
    for (let i = 0; i<value; i++) {
      array.push(word);
    }
  }
  sessionWords = array;
};


const setCurrentCard = () => {
  let num;
  let word_id;
  do {
    num = generateRandom();
    word_id = sessionWords[num].word_id;
  } while (word_id == currentCard.word_id);

  let word = sessionWords[num];
  let matches = languageWords.filter(a => a.word_id === word.word_id);
  currentCard = matches[0];
  showCard();
};

const generateRandom = () => {
  return Math.floor(Math.random() * sessionWords.length);
};

const displayResult = (value) => {
  if (actions.classList.contains("oneColumn")) {
    actions.classList.toggle("oneColumn");
  } 
  let message = value ? "Correct!" : "Wrong answer";
  actions.innerHTML = `<p>${message}</p>`;
  // console.log(sessionWords);
  let button = document.createElement("button");
  // console.log (quizLength-quizCounter);
  if (quizLength-quizCounter == 0) {
    actions.classList.toggle("oneColumn");
      actions.insertAdjacentHTML("beforeend",`<p>You got ${correctCards} out of ${quizLength} correct.</p>`);
      let playAgainButton = document.createElement("button");
      playAgainButton.addEventListener("click",setupQuiz);
      playAgainButton.textContent = "New quiz";
      actions.appendChild(playAgainButton);
    } else if (!value) {
    if (quizLength-quizCounter == 1) {
      button.textContent = "Try again";
      button.addEventListener("click", showCard);
    } else {
      button.textContent = "Next";
      button.addEventListener("click", setCurrentCard);
    }
    setTimeout(() => button.focus(), 5);
    actions.appendChild(button);
    // if right answer
  } else {
      button.textContent = "Next";
      button.addEventListener("click", setCurrentCard);
      setTimeout(() => button.focus(), 5);
      actions.appendChild(button);
  }
};

const changeInputToString = (input,isCorrect) => {
  let parent = input.parentElement;
  input.remove();
  let a = isCorrect ? "correct" : "incorrect";
  parent.insertAdjacentHTML('beforeend', `<span class="${a}">${input.value}</span>`);
};

const checkAnswer = (string) => {
  quizCounter++;
  let finished = document.getElementById("finished");
  finished.textContent = quizCounter;
  let isCorrect;
  let index = userWords.findIndex(a => a.word_id == currentCard.word_id);
  if (string == currentCard.translation) {
    isCorrect = true;
    userWords[index].times_right++;
    correctCards++;
    // let sessionWordsIndex = sessionWords.findIndex(a => a.word_id == currentCard.word_id);
    // sessionWords.splice(sessionWordsIndex,1);
  } else {
    userWords[index].times_wrong++;
    isCorrect = false;
  }
  writeToFile("writeuserwords",userWords);
  displayResult(isCorrect);
  changeInputToString(answerInput,isCorrect);
  // quizzedWords.push(userWords[index].word_id);
};

const submitAnswer = (event) => {
  if (event.key === "Enter" && event.target.value !== "") {
    checkAnswer(event.target.value);
  }
};

const getLanguageName = (id) => {
  let index = languages.findIndex(a => a.language_id == id);
  let language = languages[index].language_name;
  return capitalize(language);
};

const appendSkipButton = () => {
  let button = document.createElement("button");
  button.textContent = "Skip";
  button.addEventListener("click",setCurrentCard);
  actions.appendChild(button);
};

const showNumbers = () => {
  let topSec = document.getElementById("topSec");
  let div = document.createElement("div");
  div.innerHTML = `<span id="finished">${quizCounter}</span> / <span id="total">${quizLength}</span>`;
  topSec.appendChild(div);
};

const showCard = () => {
  cards.innerHTML = "";
  let card = document.createElement("div");
  card.classList.add("card");
  let languageName = getLanguageName(currentCard.language_id);
  card.innerHTML = `
  <div class="targetLanguage"><span>${languageName}</span><span>${currentCard.word}</span></div>
  <div class="sourceLanguage"><span>English</span><input id="answerInput" type="text"></div>
  `;
  cards.appendChild(card);
  actions.innerHTML = "";
  if (sessionWords.length > 1) {
    if (!actions.classList.contains("oneColumn")) {
      actions.classList.toggle("oneColumn");
    } 
    appendSkipButton();   
  }
  answerInput = document.getElementById("answerInput");
  setTimeout(() => answerInput.focus(),5);
  answerInput.addEventListener("keyup",submitAnswer);
};

// const startScreen = async () => {
  // let userWordsArray = userWords.map(a=>a.language_id);
  // userLanguagesIds = allLanguagesIds.filter(a => userWordsArray.includes(a));
  // otherLanguagesIds = allLanguagesIds.filter(a => !userWordsArray.includes(a));
  // root.innerHTML = "";
  // root.classList.toggle("startScreen");
  // showLanguageList(myLanguages,userLanguagesIds);
  // showLanguageList(newLanguages,otherLanguagesIds);
// };



const setLanguagesDB = (yandexLanguages) => {
  let languageArray = [];
  for (const lang in yandexLanguages) {
    let language = {
      language_id: lang,
      language_name: yandexLanguages[lang],
    };
    languageArray.push(language);
    // languages arrive sorted by id, not name, so we sort by name
    languageArray = languages.sort((a,b) => (a.language_name > b.language_name) ? 1 : -1);
  }
  localStorage.setItem("languages",JSON.stringify(languageArray));
  return languageArray;
};


const fetchLanguages = async () => {
  console.log("fetching languages");
  let url = `${urlBase}/getLangs?key=${key}&ui=en`;
  // Default options are marked with *
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response; // parses JSON response into native JavaScript objects
    let dataJson = await data.json();
    return setLanguagesDB(dataJson.langs);
  } catch (e) {
    console.log(e);
  }
}

// let languageWords = [];

// const getLanguageWords = async () => {
//   let response = await fetch("http://localhost:333/readlanguagewords");
//   console.log(response);
//   let data = await response.json();
//     console.dir(data);

//     // console.log(JSON.parse(data));
//   languageWords = data;
// };


// let userWords = [];

// const getUserWords = async () => {
//     let response = await fetch("http://localhost:333/readuserwords");
//     let data = await response.json();
//     // console.log(JSON.parse(data));
//     userWords = data;
// };


let languageWords = [];

const getLanguageWords = async () => {
  let response = await fetch("http://localhost:333/readlanguagewords");
  let data = await response.json();
  languageWords = data;
};

let userWords = [];

const getUserWords = async () => {
  let response = await fetch("http://localhost:333/readuserwords");
  let data = await response.json();
  userWords = data;
};






const getLanguages = async () => {
  await getUserWords();
  await getLanguageWords();
  languages = localStorage.getItem("languages") ? await JSON.parse(localStorage.getItem("languages")) : await fetchLanguages();
  allLanguagesIds = languages.map(a => a.language_id);
  userWordsArray = userWords.map(a=>a.language_id);
  userLanguagesIds = allLanguagesIds.filter(a => userWordsArray.includes(a));
  otherLanguagesIds = allLanguagesIds.filter(a => !userWordsArray.includes(a));
  showLanguageList(myLanguages,userLanguagesIds);
  showLanguageList(newLanguages,otherLanguagesIds);

  // startScreen();
};

getLanguages();


const addToLanguageWords = (lastId) => {
  let sources = document.querySelectorAll("#newVocabInputs > .sourceLanguage > span");
  let translations = document.querySelectorAll("#newVocabInputs > .targetLanguage > span");
  for (let i = 0; i<sources.length;i++) {
    languageWords.push({
      word_id: lastId+i+1,
      language_id: currentLanguage,
      word: translations[i].textContent,
      translation: sources[i].textContent
    });
  }
  writeToFile("writelanguagewords",languageWords);
  inputCount = 0;
};

const addToUserWords = (lastId) => {
  let sources = document.querySelectorAll("#newVocabInputs > .sourceLanguage > span");
  for (let i = 0; i<sources.length;i++) {
    userWords.push({
      user_id: thisUser,
      language_id: currentLanguage,
      word_id: lastId+i+1,
      times_right:0,
      times_wrong:0
    });
  }
  writeToFile("writeuserwords",userWords);
};

const addWordsToDBs = () => {
  let lastId = (languageWords=="") ? 0 : languageWords[languageWords.length-1].word_id;
  addToLanguageWords(lastId);
  addToUserWords(lastId);
  actions = document.getElementById("actions");
  actions.innerHTML = "<p>Your words have been added.</p>"
  let button = document.createElement("button");
  button.textContent = "Add more words";
  button.addEventListener("click",addVocabScreen);
  actions.appendChild(button);
  document.getElementById("myLanguagesSelect").remove();
  document.getElementById("newLanguagesSelect").remove();
  userWordsArray = userWords.map(a=>a.language_id);
  userLanguagesIds = allLanguagesIds.filter(a => userWordsArray.includes(a));
  otherLanguagesIds = allLanguagesIds.filter(a => !userWordsArray.includes(a));
  showLanguageList(myLanguages,userLanguagesIds);
  showLanguageList(newLanguages,otherLanguagesIds);
};





const writeToFile = (db,arr) => {
  // console.log(arr);
  try {
    fetch(`/${db}`, {
      headers: {
        "Content-type": "application/json",
      },
      method: "post",
      body: JSON.stringify(arr),
    });
  } catch (e) {
    console.log(`error occured at write user words ${e}`);
  }
};


const writeUserWords = (arr) => {
  console.log(arr);
  try {
    fetch("/writeuserwords", {
      headers: {
        "Content-type": "application/json",
      },
      method: "post",
      body: JSON.stringify(arr),
    });
  } catch (e) {
    console.log(`error occured at write user words ${e}`);
  }
};

const writeLanguageWords = (arr) => {
  console.log(arr);
  try {
    fetch("/writelanguagewords", {
      headers: {
        "Content-type": "application/json",
      },
      method: "post",
      body: JSON.stringify(arr),
    });
  } catch (e) {
    console.log(`error occured at write user words ${e}`);
  }
};

// writeLanguageWords(languageWords);




