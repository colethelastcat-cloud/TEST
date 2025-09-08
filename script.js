import { getOpenAISolution } from './openai.js';

const contentInput = document.getElementById('contentInput');
const charCount = document.getElementById('charCount');
const clearButton = document.getElementById('clearButton');
const pasteButton = document.getElementById('pasteButton');
const findSolutionButton = document.getElementById('findSolutionButton');
const newQueryButton = document.getElementById('newQueryButton');
const pasteButtonText = document.getElementById('pasteButtonText');
const pasteButtonIcon = document.getElementById('pasteButtonIcon');

const inputCard = document.getElementById('inputCard');
const answerCard = document.getElementById('answerCard');
const loadingSpinner = document.getElementById('loadingSpinner');
const answerText = document.getElementById('answerText');

contentInput.addEventListener('input', () => {
    const count = contentInput.value.length;
    charCount.textContent = `${count} characters`;
});

clearButton.addEventListener('click', () => {
    contentInput.value = '';
    contentInput.dispatchEvent(new Event('input'));
});

pasteButton.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        contentInput.value += text;
        contentInput.dispatchEvent(new Event('input'));
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        contentInput.focus();
        pasteButtonIcon.style.display = 'none';
        pasteButtonText.textContent = 'Press Ctrl+V';
        setTimeout(() => {
            pasteButtonIcon.style.display = 'inline-block';
            pasteButtonText.textContent = 'Paste';
        }, 2500);
        contentInput.addEventListener('paste', () => {
            setTimeout(() => contentInput.dispatchEvent(new Event('input')), 50);
        }, { once: true });
    }
});

findSolutionButton.addEventListener('click', async () => {
    if (contentInput.value.trim() === '') {
        return;
    }

    inputCard.classList.add('hidden');
    answerCard.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');

    try {
        const solution = await getOpenAISolution(contentInput.value);
        answerText.textContent = solution;
    } catch (error) {
        console.error(error);
        answerText.textContent = `Sorry, something went wrong while fetching the solution.\n${error.message}`;
    } finally {
        loadingSpinner.classList.add('hidden');
        answerCard.classList.remove('hidden');
    }
});

newQueryButton.addEventListener('click', () => {
    answerCard.classList.add('hidden');
    inputCard.classList.remove('hidden');
    contentInput.value = '';
    contentInput.dispatchEvent(new Event('input'));
});

