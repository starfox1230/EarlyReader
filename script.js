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

    // Use 'touchstart' event for more responsive interaction on touch devices
    document.getElementById('prevWordButton').addEventListener('touchstart', function(e) {
        e.preventDefault(); // Prevents the browser's default touch behavior
        prevWord();
    });
    
    document.getElementById('nextWordButton').addEventListener('touchstart', function(e) {
        e.preventDefault(); // Prevents the browser's default touch behavior
        nextWord();
    });

    // Hide the Insert Story button and text area after the button is clicked
    document.getElementById('pasteStoryButton').style.display = 'none';
    document.getElementById('storyArea').style.display = 'none';

    updateSentence();
});
