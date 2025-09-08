import { getOpenAISolution } from './api/openai.js';

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
    charCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
});

clearButton.addEventListener('click', () => {
    contentInput.value = '';
    contentInput.dispatchEvent(new Event('input'));
});

pasteButton.addEventListener('click', () => {
    contentInput.focus();
    try {
        const successful = document.execCommand('paste');
        if (!successful) {
            console.error('Paste command was not successful. The browser may have blocked it.');
        }
        setTimeout(() => contentInput.dispatchEvent(new Event('input')), 100);
    } catch (err) {
        console.error('Failed to execute paste command: ', err);
    }
});

findSolutionButton.addEventListener('click', async () => {
    if (contentInput.value.trim() === '') {
        contentInput.classList.add('border-red-500', 'animate-pulse');
        setTimeout(() => {
            contentInput.classList.remove('border-red-500', 'animate-pulse');
        }, 1500);
        return;
    }
    
    inputCard.classList.add('hidden');
    answerCard.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');

    try {
        const solutionText = await getOpenAISolution(contentInput.value);
        answerText.textContent = solutionText;
    } catch (error) {
        console.error("Failed to fetch solution:", error);
        answerText.innerHTML = `<p class="text-red-400">Sorry, something went wrong while fetching the solution.</p><p class="text-xs text-gray-500 mt-2">${error.message}</p>`;
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

const dropzone = document.querySelector('main');

dropzone.addEventListener('dragenter', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inputCard.classList.contains('hidden')) {
        inputCard.classList.add('scale-105', 'shadow-blue-500/30');
        inputCard.classList.remove('shadow-blue-500/10');
    }
});

dropzone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inputCard.classList.contains('hidden')) {
        inputCard.classList.remove('scale-105', 'shadow-blue-500/30');
        inputCard.classList.add('shadow-blue-500/10');
    }
});

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inputCard.classList.contains('hidden')) {
        inputCard.classList.remove('scale-105', 'shadow-blue-500/30');
        inputCard.classList.add('shadow-blue-500/10');
    }
});

