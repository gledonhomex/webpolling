// Simulated database of users
const usersDatabase = [
    { username: 'admin1', password: 'admin123', role: 'admin', kelas: '', kelompok: '', has_voted: false },
    { username: 'voter1', password: 'voter123', role: 'voter', kelas: 'XI-1', kelompok: '', has_voted: false },
    { username: 'idol1', password: 'idol123', role: 'idol', kelas: 'XI-1', kelompok: '1', has_voted: false }
];

// Function to authenticate user
import { authenticateUser } from './database.js';

// Function to check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('pollingUser') !== null;
}

// Function to get current user
function getCurrentUser() {
    const userData = localStorage.getItem('pollingUser');
    return userData ? JSON.parse(userData) : null;
}

// Function to handle logout
function handleLogout() {
    localStorage.removeItem('pollingUser');
    window.location.href = 'index.html';
}

export {
    isLoggedIn,
    getCurrentUser,
    handleLogout
};

// Function to check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('pollingUser') !== null;
}

// Function to get current user
function getCurrentUser() {
    const userData = localStorage.getItem('pollingUser');
    return userData ? JSON.parse(userData) : null;
}
