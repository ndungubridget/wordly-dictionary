/* ‌Get ‌the ‌elements from HTML */
const searchForm = document.getElementById("search-form");
console.log("Wordly JavaScript is running");
const wordInput = document.getElementById("word-input");
const errorMessage = document.getElementById("error-message");

const wordTitle = document.getElementById("word-title");
const partOfSpeech = document.getElementById("part-of-speech");
const definition = document.getElementById("definition");
const example = document.getElementById("example");
const pronunciation = document.getElementById("pronunciation");
const audioPlayer = document.getElementById("pronunciation-audio");
const synonymsList = document.getElementById("synonyms-list");

const saveWordButton = document.getElementById("save-word-button");
const favoritesList = document.getElementById("favorites-list");
const themeButton = document.getElementById("theme-button");

/* Store saved words */
const savedWords = [];

/* Search for a word */
searchForm.addEventListener("submit", function(event) {
    console.log("Search button clicked");
    event.preventDefault();
    const word = wordInput.value.trim();

    if (word === "") {
        errorMessage.textContent = "Please enter a word.";
        return;
    }

    errorMessage.textContent = "Searching...";

    const url =
        "https://api.dictionaryapi.dev/api/v2/entries/en/" +
        encodeURIComponent(word);

    fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Word not found.");
            }

            return response.json();
        })
        .then(function(data) {
            /* Check that the response has a definition */
            if (
                !data ||
                data.length === 0 ||
                !data[0].meanings ||
                data[0].meanings.length === 0
            ) {
                throw new Error("No definition available.");
            }

            const entry = data[0];
            const meaning = entry.meanings[0];

            if (
                !meaning.definitions ||
                meaning.definitions.length === 0
            ) {
                throw new Error("No definition available.");
            }

            const wordDefinition = meaning.definitions[0];

            /* Display the word and its meaning */
            wordTitle.textContent = entry.word;

            partOfSpeech.textContent =
                "Part of speech: " + meaning.partOfSpeech;

            definition.textContent =
                "Definition: " + wordDefinition.definition;

            /* Display an example if available */
            if (wordDefinition.example) {
                example.textContent =
                    "Example: " + wordDefinition.example;
            } else {
                example.textContent = "No example available.";
            }

            /* Display pronunciation and audio */
            pronunciation.textContent =
                "Pronunciation not available.";

            audioPlayer.removeAttribute("src");
            audioPlayer.hidden = true;

            const phonetics = entry.phonetics || [];

            for (let i = 0; i < phonetics.length; i++) {
                const sound = phonetics[i];

                if (
                    sound.text &&
                    pronunciation.textContent ===
                    "Pronunciation not available."
                ) {
                    pronunciation.textContent =
                        "Pronunciation: " + sound.text;
                }

                if (sound.audio && audioPlayer.hidden) {
                    audioPlayer.src = sound.audio;
                    audioPlayer.hidden = false;
                }
            }

            /* Display similar words */
            synonymsList.innerHTML = "";

            let synonyms = meaning.synonyms || [];

            if (synonyms.length === 0) {
                synonyms = wordDefinition.synonyms || [];
            }

            if (synonyms.length === 0) {
                const item = document.createElement("li");
                item.textContent = "No synonyms available.";
                synonymsList.appendChild(item);
            } else {
                for (let i = 0; i < synonyms.length; i++) {
                    const item = document.createElement("li");
                    item.textContent = synonyms[i];
                    synonymsList.appendChild(item);
                }
            }

            errorMessage.textContent = "";
        })
        .catch(function(error) {
            errorMessage.textContent =
                "Word not found or unable to connect. Please try again.";

            console.log(error);
        });
});

/* Save a word */
saveWordButton.addEventListener("click", function() {
    const word = wordTitle.textContent;

    if (
        word === "" ||
        word === "Your word will appear here"
    ) {
        errorMessage.textContent = "Search for a word first.";
        return;
    }

    if (savedWords.includes(word)) {
        errorMessage.textContent = "This word is already saved.";
        return;
    }

    savedWords.push(word);

    const item = document.createElement("li");
    item.textContent = word;
    favoritesList.appendChild(item);

    errorMessage.textContent = "Word saved!";
});

/* Change the page theme */
themeButton.addEventListener("click", function() {
    document.body.classList.toggle("dark-theme");
});