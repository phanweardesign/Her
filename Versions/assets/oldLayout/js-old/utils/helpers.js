function $(selector) {
    return document.querySelector(selector);
}

function $all(selector) {
    return document.querySelectorAll(selector);
}

function createId() {
    return Date.now().toString() + Math.random().toString(36).substring(2, 8);
}

function formatDate(date = new Date()) {
    return new Date(date).toLocaleString();
}

function safeText(value, fallback = "") {
    return value ? String(value) : fallback;
}

function redirectTo(path) {
    window.location.href = path;
}

function showElement(selector) {
    const el = $(selector);
    if (el) el.classList.remove("hidden");
}

function hideElement(selector) {
    const el = $(selector);
    if (el) el.classList.add("hidden");
}

function setText(selector, text) {
    const el = $(selector);
    if (el) el.textContent = text;
}

function getInputValue(selector) {
    const el = $(selector);
    return el ? el.value.trim() : "";
}