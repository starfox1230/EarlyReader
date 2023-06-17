window.onload = function() {
    document.getElementById('buttons').style.display = 'none';
    document.getElementById('sentenceDisplay').style.display = 'none';
};

var text, sentences, currentSentenceIndex, currentWordIndex;
var isStoryInserted = false;

function updateSentence() {
    var sentenceDisplay = document.getElementById('sentenceDisplay');
    sentenceDisplay.innerHTML = '';
    sentences[currentSentenceIndex].forEach(function(token, index) {
        if (token.isWord && index === currentWordIndex) {
            sentenceDisplay.innerHTML += '<span class="highlight">' + token.content + '</span>';
        } else {
            sentenceDisplay.innerHTML += token.content;
        }
    });
}

function prevWord() {
    if (!isStoryInserted) return;
    do {
        if (currentWordIndex > 0) {
            currentWordIndex -= 1;
        } else if (currentSentenceIndex > 0) {
            currentSentenceIndex -= 1;
            currentWordIndex = sentences[currentSentenceIndex].length - 1;
        } else { // If we've reached the beginning of the sentences, return to avoid crashing
            return;
        }
    } while (!sentences[currentSentenceIndex][currentWordIndex].isWord);
    updateSentence();
}


function nextWord() {
    if (!isStoryInserted) return;
    do {
        if (currentWordIndex < sentences[currentSentenceIndex].length - 1) {
            currentWordIndex += 1;
        } else if (currentSentenceIndex < sentences.length - 1) {
            currentSentenceIndex += 1;
            currentWordIndex = 0;
        } else { // If we've reached the end of the sentences, return to avoid crashing
            return;
        }
    } while (!sentences[currentSentenceIndex][currentWordIndex].isWord);
    updateSentence();
}

document.getElementById('pasteStoryButton').addEventListener('click', function() {
    text = document.getElementById('storyArea').value;
    var rawSentences = text.split(/(?<=[.!?]["']?)\s+/);
    sentences = rawSentences.map(function(sentence) {
        return sentence.split(/((?:\b\w+['’]\w+\b)|\b\w+\b|\s+)/).filter(Boolean).map(function(token) {
            return { content: token, isWord: /\w/.test(token) };
        });
    });
    currentSentenceIndex = 0;
    currentWordIndex = 0;
    isStoryInserted = true;

    document.getElementById('prevWordButton').addEventListener('touchstart', function(e) {
        e.preventDefault();
        prevWord();
    });
    document.getElementById('prevWordButton').addEventListener('click', prevWord);

    document.getElementById('nextWordButton').addEventListener('touchstart', function(e) {
        e.preventDefault();
        nextWord();
    });
    document.getElementById('nextWordButton').addEventListener('click', nextWord);

    document.getElementById('pasteStoryButton').style.display = 'none';
    document.getElementById('storyArea').style.display = 'none';

    document.getElementById('buttons').style.display = 'block';
    document.getElementById('sentenceDisplay').style.display = 'block';

    updateSentence();  // Highlight the first word
});


window.addEventListener('keydown', function(e) {
    if (e.key === "ArrowRight") {
        nextWord();
    } else if (e.key === "ArrowLeft") {
        prevWord();
    }
});
