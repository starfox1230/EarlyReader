function preventZoom(e) {
    var now = (new Date()).getTime();
    if (now - this.lastTouchEnd <= 300) {
        e.preventDefault();
    }
    this.lastTouchEnd = now;
}

document.getElementById('pasteStoryButton').addEventListener('click', function() {
    var text = document.getElementById('storyArea').value;
    var sentences = text.split(/(?<=[.!?])\s+(?=[a-z"])/i);
    sentences = sentences.map(function(sentence) {
        return sentence.trim().split(" ");
    });
    var currentSentenceIndex = 0;
    var currentWordIndex = 0;

    function updateSentence() {
        var sentenceDisplay = document.getElementById('sentenceDisplay');
        sentenceDisplay.innerHTML = '';
        sentences[currentSentenceIndex].forEach(function(word, index) {
            if (index === currentWordIndex) {
                sentenceDisplay.innerHTML += '<span class="highlight">' + word + '</span> ';
            } else {
                sentenceDisplay.innerHTML += word + ' ';
            }
        });
    }

    function prevWord() {
        if (currentWordIndex > 0) {
            currentWordIndex -= 1;
        } else if (currentSentenceIndex > 0) {
            currentSentenceIndex -= 1;
            currentWordIndex = sentences[currentSentenceIndex].length - 1;
        }
        updateSentence();
    }

    function nextWord() {
        if (currentWordIndex < sentences[currentSentenceIndex].length - 1) {
            currentWordIndex += 1;
        } else if (currentSentenceIndex < sentences.length - 1) {
            currentSentenceIndex += 1;
            currentWordIndex = 0;
        }
        updateSentence();
    }

    var prevButton = document.getElementById('prevWordButton');
    prevButton.lastTouchEnd = 0;
    prevButton.addEventListener('touchend', preventZoom, false);
    prevButton.addEventListener('click', prevWord);

    var nextButton = document.getElementById('nextWordButton');
    nextButton.lastTouchEnd = 0;
    nextButton.addEventListener('touchend', preventZoom, false);
    nextButton.addEventListener('click', nextWord);

    updateSentence();
});
