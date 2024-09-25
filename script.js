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
        } else {
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
        } else {
            return;
        }
    } while (!sentences[currentSentenceIndex][currentWordIndex].isWord);
    updateSentence();
}

document.getElementById('pasteStoryButton').addEventListener('click', function() {
    text = document.getElementById('storyArea').value;
    // Updated regex for better sentence parsing with quotations
    var rawSentences = text.match(/[^.!?]+[.!?]+(?:["'”’]+)?(\s+|$)/g);
    if (!rawSentences) {
        rawSentences = [text]; // Handle case where regex returns null
    }
    sentences = rawSentences.map(function(sentence) {
        return sentence.trim().split(/((?:\b\w+['’]\w+\b)|\b\w+\b|\s+|\S)/).filter(Boolean).map(function(token) {
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
    } else if (e.key === "F1") {
        e.preventDefault(); // Prevent default F1 action (help menu)
        triggerWrongAnswerEffect();
    } else if (e.key === " ") {
        e.preventDefault(); // Prevent default spacebar scrolling
        triggerCorrectAnswerEffect();
    }
});

function triggerWrongAnswerEffect() {
    var highlightedWord = document.querySelector('.highlight');
    if (!highlightedWord) return;
    highlightedWord.classList.add('wrong-answer');
    setTimeout(function() {
        highlightedWord.classList.remove('wrong-answer');
    }, 1000); // Revert after 1 second
}

function triggerCorrectAnswerEffect() {
    var highlightedWord = document.querySelector('.highlight');
    if (!highlightedWord) return;
    highlightedWord.classList.add('correct-answer');
    setTimeout(function() {
        highlightedWord.classList.remove('correct-answer');
        nextWord();
    }, 500); // Short delay before moving to next word
}