let language_words = [
	{word_id:1,language_id:1,word:"un",translation:"one",part_of_speech:"number"},
	{word_id:2,language_id:1,word:"deux",translation:"two",part_of_speech:"number"},
	{word_id:3,language_id:1,word:"trois",translation:"three",part_of_speech:"number"},
	{word_id:4,language_id:1,word:"chien",translation:"dog",part_of_speech:"noun"},
	{word_id:5,language_id:1,word:"chat",translation:"cat",part_of_speech:"noun"},
	{word_id:6,language_id:2,word:"uno",translation:"one",part_of_speech:"number"}
	];

let languages = [{language_id:1,language_name:"french"},{language_id:2,language_name:"spanish"}];

let root = document.getElementById("root");

const showLanguageList = () => {
	let select = document.createElement("select");
	for (let item of languages) {
		let option = document.createElement("option");
		option.setAttribute("value",item.language_id);
		option.textContent = item.language_name;
		select.appendChild(option);
	}
	root.appendChild(select)
}
showLanguageList();

let userWords =[
{user_id:1,language_id:1,word_id:1,times_right:0,times_wrong:0},
{user_id:1,language_id:1,word_id:2,times_right:0,times_wrong:0},
{user_id:2,language_id:1,word_id:1,times_right:0,times_wrong:0}
]

let thisUser = 1;

let sessionWords;

let getSessionWords = (user_id) => {
	sessionWords = userWords.filter(a => a.user_id == user_id);
}

getSessionWords(thisUser);

let currentCard;

setCurrentCard = (word) => {
	let matches = language_words.filter(a => a.word_id === word.word_id);
	currentCard = { word_id:matches[0].word_id, word:matches[0].word, translation: matches[0].translation};
}

setCurrentCard(sessionWords[1]);

const checkAnswer = (string) => {
	if (string == currentCard.translation) {
		console.log("Correct");
		// userWords
	} else {
		console.log("Wrong")
	}
}

const submitAnswer = (event) => {
	if (event.key == "Enter") {
		checkAnswer(event.target.value);
	}
}

const showCard = () => {
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

showCard();








