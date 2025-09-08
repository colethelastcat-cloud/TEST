import { getOpenAISolution } from './openai.js';

const contentInput = document.getElementById('contentInput');
const charCount = document.getElementById('charCount');
const clearButton = document.getElementById('clearButton');
const pasteButton = document.getElementById('pasteButton');
const findSolutionButton = document.getElementById('findSolutionButton');
const newQueryButton = document.getElementById('newQueryButton');
const pasteButtonText = document.getElementById('pasteButtonText');
const pasteButtonIcon = document.getElementById('pasteButtonIcon');
const imagePreview = document.getElementById('imagePreview');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const removeImageButton = document.getElementById('removeImageButton');
const dropzone = document.getElementById('dropzone');

const inputCard = document.getElementById('inputCard');
const answerCard = document.getElementById('answerCard');
const loadingSpinner = document.getElementById('loadingSpinner');
const answerText = document.getElementById('answerText');

let uploadedImageBase64 = null;

function clearAllInputs() {
    contentInput.value = '';
    contentInput.dispatchEvent(new Event('input'));
    removeImage();
}

function removeImage() {
    uploadedImageBase64 = null;
    imagePreviewContainer.classList.add('hidden');
    imagePreview.src = '';
}

function handleImageFile(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            uploadedImageBase64 = event.target.result;
            imagePreview.src = uploadedImageBase64;
            imagePreviewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
        return true;
    }
    return false;
}

contentInput.addEventListener('input', () => {
    const count = contentInput.value.length;
    charCount.textContent = `${count} characters`;
});

clearButton.addEventListener('click', clearAllInputs);
removeImageButton.addEventListener('click', removeImage);

pasteButton.addEventListener('click', async () => {
    try {
        const clipboardItems = await navigator.clipboard.read();
        let imageFound = false;
        for (const item of clipboardItems) {
            const imageType = item.types.find(type => type.startsWith('image/'));
            if (imageType) {
                const blob = await item.getType(imageType);
                handleImageFile(blob);
                imageFound = true;
                break; 
            }
        }
        if (imageFound) return;

        const text = await navigator.clipboard.readText();
        contentInput.value += text;
        contentInput.dispatchEvent(new Event('input'));
    } catch (err) {
        console.error('Clipboard API failed, falling back to prompt:', err);
        contentInput.focus();
        pasteButtonIcon.style.display = 'none';
        pasteButtonText.textContent = 'Press Ctrl+V';
        setTimeout(() => {
            pasteButtonIcon.style.display = 'inline-block';
            pasteButtonText.textContent = 'Paste';
        }, 2500);
    }
});

dropzone.addEventListener('paste', (e) => {
    e.preventDefault();
    const items = e.clipboardData.items;
    for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (handleImageFile(file)) {
                return;
            }
        }
    }
});

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('border-blue-500', 'bg-gray-800/50');
});

dropzone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropzone.classList.remove('border-blue-500', 'bg-gray-800/50');
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('border-blue-500', 'bg-gray-800/50');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleImageFile(files[0]);
    }
});

findSolutionButton.addEventListener('click', async () => {
    const userText = contentInput.value.trim();
    if (userText === '' && !uploadedImageBase64) {
        return;
    }

    inputCard.classList.add('hidden');
    answerCard.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');

    try {
        const solution = await getOpenAISolution(userText, uploadedImageBase64);
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
    clearAllInputs();
});

