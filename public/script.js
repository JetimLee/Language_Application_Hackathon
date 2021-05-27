let language_words = [
	{word_id:1,language_id:1,word:"un",translation:"one",part_of_speech:"number"},
	{word_id:2,language_id:1,word:"deux",translation:"two",part_of_speech:"number"},
	{word_id:3,language_id:1,word:"trois",translation:"three",part_of_speech:"number"},
	{word_id:4,language_id:1,word:"chien",translation:"dog",part_of_speech:"noun"},
	{word_id:5,language_id:1,word:"chat",translation:"cat",part_of_speech:"noun"},
	{word_id:6,language_id:2,word:"uno",translation:"one",part_of_speech:"number"}
	];

let languages = [
{language_id:1,language_name:"french"},
{language_id:2,language_name:"spanish"},
{language_id:3,language_name:"italian"},
{language_id:4,language_name:"japanese"},
];

let userWords =[
{user_id:1,language_id:1,word_id:1,times_right:0,times_wrong:0},
{user_id:1,language_id:1,word_id:2,times_right:0,times_wrong:0},
{user_id:1,language_id:2,word_id:1,times_right:0,times_wrong:0},
{user_id:2,language_id:1,word_id:1,times_right:0,times_wrong:0}
]

let root = document.getElementById("root");

let userLanguagesIds;
let otherLanguagesIds;
let allLanguagesIds = languages.map(a => a.language_id);
let currentLanguage;

const capitalize = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const selectLanguage = (event) => {
	if (event.target.value >= 0) {
		currentLanguage = event.target.value;
		if (event.target.id == "select1") {
			console.log(event.target)
			console.log(event.target.id)
			getSessionWords();
		}
	}
}

const showLanguageList = (ids = allLanguagesIds,div) => {
	let select = document.createElement("select");
	let id = (div.id == "div1" ? "select1" : "select2");
	select.id = id;
	let subsetLanguages = languages.filter(a => ids.includes(a.language_id));
	let option = document.createElement("option");
		option.textContent = "Select one";
		select.appendChild(option);
	for (let item of subsetLanguages) {
		let option = document.createElement("option");
		option.setAttribute("value",item.language_id);
		option.textContent = capitalize(item.language_name); 
		select.appendChild(option);
	}
	select.addEventListener("change",selectLanguage);
	div.appendChild(select);
}

const startScreen = () => {
	let userWordsArray = userWords.map(a=>a.language_id);
	userLanguagesIds = allLanguagesIds.filter(a => userWordsArray.includes(a));
	otherLanguagesIds = allLanguagesIds.filter(a => !userWordsArray.includes(a));
	root.innerHTML = "";
	root.classList.toggle("startScreen");
	let div1 = document.createElement("div");
	div1.id = "div1";
	div1.innerHTML = `<p>Welcome! Choose one of your languages to practice:</p>`
	root.appendChild(div1);
	showLanguageList(userLanguagesIds,div1);
	let div2 = document.createElement("div");
	div2.id = "div2";
	div2.innerHTML = `<p>Or you can choose a new language:</p>`
	root.appendChild(div2);
	showLanguageList(otherLanguagesIds,div2);
}

startScreen();

let thisUser = 1;

let sessionWords;

let getSessionWords = () => {
	sessionWords = userWords.filter(a => a.user_id == thisUser && a.language_id == currentLanguage);
	console.log(sessionWords);
	setCurrentCard(sessionWords[0]);
}

let currentCard;

setCurrentCard = (word) => {
	let matches = language_words.filter(a => a.word_id === word.word_id);
	currentCard = matches[0];
	showCard();
}


const checkAnswer = (string) => {
	index = userWords.findIndex(a => a.word_id == currentCard.word_id);
	if (string == currentCard.translation) {
		console.log("Correct");
		userWords[index].times_right++;
	} else {
		console.log("Wrong")
		userWords[index].times_wrong++;
	}
}

const submitAnswer = (event) => {
	if (event.key == "Enter") {
		checkAnswer(event.target.value);
	}
}

const showCard = () => {
	root.innerHTML = "";
	root.classList.toggle("startScreen");
	let card = document.createElement("div");
	card.classList.add("card");
	card.innerHTML = `
	<div>${currentCard.word}</div>
	<div><input id="answer" type="text"></div>
	`;
	root.appendChild(card);
	let answer = document.getElementById("answer");
	answer.addEventListener("keyup",submitAnswer)
}









