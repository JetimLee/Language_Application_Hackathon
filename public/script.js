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
{user_id:1,language_id:2,word_id:6,times_right:0,times_wrong:0},
{user_id:2,language_id:1,word_id:3,times_right:0,times_wrong:0}
]

let root = document.getElementById("root");
let score;
let cards;
let actions;
let answerInput;
inputCount = 0;

let userLanguagesIds;
let otherLanguagesIds;
let allLanguagesIds = languages.map(a => a.language_id);
let currentLanguage;

const capitalize = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

const setCurrentLanguage = (id) => {
	currentLanguage = id;
	let header = document.querySelector("header");
	header.insertAdjacentHTML('beforeend', `<h1 class="targetLanguage">${getLanguageName(id)}</h1>`);
	;
} 

const selectLanguage = (event) => {
	if (event.target.value >= 0) {
		// currentLanguage = event.target.value;
		setCurrentLanguage(event.target.value);
		// if user chooses language already learning or new one
		root.classList.toggle("startScreen");
		if (event.target.id == "select1") {
			getSessionWords();
			reviewOrQuiz();
		} else {
			newVocabScreen();
		}
	}
}

const newVocabScreen = () => {
	root.classList.toggle("newVocabScreen");
	root.innerHTML = `
	<p>Enter up to ten new words or phrases you want to study</p>`
	let newVocabInputs = document.createElement("div")
	newVocabInputs.id = "newVocabInputs";
	newVocabInputs.appendChild(createInput());
	root.appendChild(newVocabInputs);
}

const submitWord = (event) => {
	if (event.key === "Enter" && event.target.value !== "") {
		changeInputToString(event.target);
		getTranslation(event.target.value);
	}
}

const createInput = () => {
	let div = document.createElement("div");
	div.classList.add("sourceLanguage");
	let input = document.createElement("input");
	input.addEventListener("keyup",submitWord);
	div.appendChild(input);
	inputCount++;
	setTimeout(() => input.focus(),5);

	return div;
}

const getTranslation = (string) => {
	let translation = "ice cream";
	let newVocabInputs = document.getElementById("newVocabInputs");
	newVocabInputs.insertAdjacentHTML('beforeend', `<div class="targetLanguage"><span>${translation}</span></div>`);
	// addWordToDBs(string);
	if (inputCount < 10) {
		newVocabInputs.appendChild(createInput());
	}
}

const reviewOrQuiz = () => {
	// root.innerHTML = "";
	// let div = document.createElement("div");

	// button
	root.classList.toggle("cardScreen");
	root.innerHTML = `<div id="score"></div><div id="cards"></div><div id="actions"></div>`
	score = document.getElementById("score");
	cards = document.getElementById("cards");
	actions = document.getElementById("actions");
	showNumbers();
	setCurrentCard();
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
}

let quizzedWords = [];
let correctAnswers = 0;

let currentCard = {word_id:null};

const setCurrentCard = () => {
	let num;
	let word_id;
	do {
		num = generateRandom();
		word_id = sessionWords[num].word_id;
	} while (word_id == currentCard.word_id);

	let word = sessionWords[num];
	let matches = language_words.filter(a => a.word_id === word.word_id);
	currentCard = matches[0];
	showCard();
}

const generateRandom = () => {
	return Math.floor(Math.random() * sessionWords.length);
}

const displayResult = (value) => {
	let message = value ? "Correct!" : "Wrong answer"
	actions.innerHTML = `<p>${message}</p>`;
	if ((value && sessionWords.length > 0) || (!value && sessionWords.length > 1)) {
		let button = document.createElement("button");
		button.textContent = "Next";
		button.addEventListener("click",setCurrentCard)
		actions.appendChild(button);
	} else if (!value && sessionWords.length == 1) {
		let button = document.createElement("button");
		button.textContent = "Try again";
		button.addEventListener("click",showCard)
		actions.appendChild(button);
	}
}

const changeInputToString = (input) => {
	let parent = input.parentElement;
	input.remove();
	parent.insertAdjacentHTML('beforeend', `<span>${input.value}</span>`);
}

const checkAnswer = (string) => {
	changeInputToString(answerInput,string)
	// let parent = answer.parentElement;
	// input.remove();
	// parent.insertAdjacentHTML('beforeend', `<span>${string}</span>`);
	index = userWords.findIndex(a => a.word_id == currentCard.word_id);
	if (string == currentCard.translation) {
		userWords[index].times_right++;
		correctAnswers++;
		let correct = document.getElementById("correct");
		correct.textContent = correctAnswers;
		let sessionWordsIndex = sessionWords.findIndex(a => a.word_id == currentCard.word_id);
		sessionWords.splice(sessionWordsIndex,1);
		displayResult(true);
	} else {
		userWords[index].times_wrong++;
		displayResult(false);
	}
	quizzedWords.push(userWords[index].word_id);
}

const submitAnswer = (event) => {
	if (event.key === "Enter" && event.target.value !== "") {
		checkAnswer(event.target.value);
	}
}

const getLanguageName = (id) => {
	let index = languages.findIndex(a => a.language_id == id);
	let language = languages[index].language_name;
	return capitalize(language);
}

const appendSkipButton = () => {
	let button = document.createElement("button");
	button.textContent = "Skip";
	button.addEventListener("click",setCurrentCard)
	actions.appendChild(button);
}

const showNumbers = () => {
	let score = document.getElementById("score")
	let div = document.createElement("div");
	div.innerHTML = `<span id="correct">${correctAnswers}</span> / <span id="total">${sessionWords.length}</span>`;
	score.appendChild(div);
}

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
		appendSkipButton();		
	}
	answerInput = document.getElementById("answerInput");
	setTimeout(() => answerInput.focus(),5);
	answerInput.addEventListener("keyup",submitAnswer);
}




