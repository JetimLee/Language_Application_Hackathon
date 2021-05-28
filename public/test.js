let userWords;
const getUserWords = async () => {
  console.log(`i work`);
  let response = await fetch("http://localhost:333/userwords");
  let data = await response.json();
  userWords = data;
  console.log(userWords);
};
getUserWords();

let languageWords;

const getLanguageWords = async () => {
  console.log("i also work");
  let response = await fetch("http://localhost:333/languagewords");
  let data = await response.json();
  languageWords = data;
  console.log(languageWords);
};

getLanguageWords();
