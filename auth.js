// Simulated database of users
const usersDatabase = [
    { username: 'admin1', password: 'admin123', role: 'admin', kelas: '', kelompok: '', has_voted: false },
    { username: 'voter1', password: 'voter123', role: 'voter', kelas: 'XI-1', kelompok: '', has_voted: false },
    { username: 'idol1', password: 'idol123', role: 'idol', kelas: 'XI-1', kelompok: '1', has_voted: false }
];

// Function to authenticate user
function authenticateUser(username, password) {
    return new Promise((resolve, reject) => {
        // Simulate API call delay
        setTimeout(() => {
            const user = usersDatabase.find(u => 
                u.username === username && u.password === password);
            
            if (user) {
                // Clone the user object to avoid modifying the original
                const userCopy = JSON.parse(JSON.stringify(user));
                resolve(userCopy);
            } else {
                resolve(null);
            }
        }, 500);
    });
}

// Function to check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('pollingUser') !== null;
}

// Function to get current user
function getCurrentUser() {
    const userData = localStorage.getItem('pollingUser');
    return userData ? JSON.parse(userData) : null;
}
