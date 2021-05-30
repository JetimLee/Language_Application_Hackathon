console.log("test is working");
let userWords;
const getUserWords = async () => {
  console.log(`i work`);
  let response = await fetch("http://localhost:333/readuserwords");
  let data = await response.json();
  userWords = data;
  console.log(userWords);
};
getUserWords();

let languageWords;

const getLanguageWords = async () => {
  console.log("i also work");
  let response = await fetch("http://localhost:333/readlanguagewords");
  let data = await response.json();
  languageWords = data;
  console.log(languageWords);
};

getLanguageWords();

window.addEventListener("load", (event) => {
  if (sessionStorage.getItem("myapp_token") === null) {
    // alert(`it appears you're not logged in, routing you to login`);
    window.open("./login.html", "_self");
    console.log(`there ain't no token here`);
  }
  if (sessionStorage.getItem("myapp_token") !== null) {
    // alert(`welcome to the app!`);
    console.log(`i found a token!`);
  }
});

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
//ALL POST REQUESTS NEED HEADERS N STUFF

let wordsArray = [
  {
    word_id: 1,
    language_id: "fr",
    word: "un",
    translation: "one",
    part_of_speech: "number",
  },
  {
    word_id: 2,
    language_id: "fr",
    word: "deux",
    translation: "two",
    part_of_speech: "number",
  },
  {
    word_id: 3,
    language_id: "fr",
    word: "trois",
    translation: "three",
    part_of_speech: "number",
  },
  {
    word_id: 4,
    language_id: "fr",
    word: "chien",
    translation: "dog",
    part_of_speech: "noun",
  },
  {
    word_id: 5,
    language_id: "fr",
    word: "chat",
    translation: "cat",
    part_of_speech: "noun",
  },
  {
    word_id: 6,
    language_id: "es",
    word: "uno",
    translation: "one",
    part_of_speech: "number",
  },
];

writeLanguageWords(wordsArray);
