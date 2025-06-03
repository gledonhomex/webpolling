// Global variables
let currentUser = null;
const APP_NAME = "Polling Website";

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuth();
    
    // Setup event listeners
    setupEventListeners();
});

function checkAuth() {
    const userData = localStorage.getItem('pollingUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        redirectBasedOnRole();
    } else if (!window.location.pathname.includes('login.html') && 
               !window.location.pathname.includes('index.html')) {
        window.location.href = 'login.html';
    }
}

async function loadIdols() {
    const idolsContainer = document.getElementById('idolsContainer');
    idolsContainer.innerHTML = '<p>Memuat data idol...</p>';
    
    try {
        const idols = await getIdols();
        const classes = [...new Set(idols.map(idol => idol.kelas))];
        
        // Isi dropdown filter kelas
        const kelasSelect = document.getElementById('kelasSelect');
        kelasSelect.innerHTML = '<option value="all">Semua Kelas</option>';
        classes.forEach(kelas => {
            const option = document.createElement('option');
            option.value = kelas;
            option.textContent = kelas;
            kelasSelect.appendChild(option);
        });
        
        displayIdols(idols);
    } catch (error) {
        console.error('Error loading idols:', error);
        idolsContainer.innerHTML = '<p class="error">Gagal memuat data idol. Silakan coba lagi.</p>';
    }
}

async function handleVote(idolId) {
    if (!currentUser || currentUser.has_voted) return;
    
    try {
        const result = await saveVote(currentUser.username, idolId);
        
        if (result.success) {
            alert('Vote Anda berhasil dicatat!');
            
            // Update UI
            currentUser.has_voted = true;
            localStorage.setItem('pollingUser', JSON.stringify(currentUser));
            
            // Disable semua tombol vote
            document.querySelectorAll('.vote-btn').forEach(btn => {
                btn.disabled = true;
                btn.textContent = 'Sudah Vote';
            });
            
            // Refresh data idol untuk update jumlah vote
            await loadIdols();
        } else {
            alert('Gagal menyimpan vote: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Vote error:', error);
        alert('Terjadi kesalahan saat memproses vote Anda');
    }
}

function redirectBasedOnRole() {
    if (!currentUser) return;
    
    const currentPage = window.location.pathname.split('/').pop();
    let shouldRedirect = false;
    let targetPage = '';
    
    switch(currentUser.role) {
        case 'admin':
            if (currentPage !== 'admin.html') {
                shouldRedirect = true;
                targetPage = 'admin.html';
            }
            break;
        case 'idol':
            if (currentPage !== 'idol.html') {
                shouldRedirect = true;
                targetPage = 'idol.html';
            }
            break;
        case 'voter':
            if (currentPage !== 'voter.html') {
                shouldRedirect = true;
                targetPage = 'voter.html';
            }
            break;
    }
    
    if (shouldRedirect) {
        window.location.href = targetPage;
    } else {
        loadPageContent();
    }
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Admin tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Save max votes button
    const saveMaxVotesBtn = document.getElementById('saveMaxVotes');
    if (saveMaxVotesBtn) {
        saveMaxVotesBtn.addEventListener('click', saveMaxVotes);
    }
    
    // Idol form
    const idolForm = document.getElementById('idolForm');
    if (idolForm) {
        idolForm.addEventListener('submit', updateIdolProfile);
    }
    
    // Kelas filter
    const kelasSelect = document.getElementById('kelasSelect');
    if (kelasSelect) {
        kelasSelect.addEventListener('change', filterIdolsByClass);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // In a real app, you would verify credentials with your database
    // Here we'll simulate a database check
    authenticateUser(username, password)
        .then(user => {
            if (user) {
                currentUser = user;
                localStorage.setItem('pollingUser', JSON.stringify(user));
                redirectBasedOnRole();
            } else {
                document.getElementById('loginError').textContent = 'Username atau password salah';
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            document.getElementById('loginError').textContent = 'Terjadi kesalahan saat login';
        });
}

function handleLogout() {
    localStorage.removeItem('pollingUser');
    currentUser = null;
    window.location.href = 'index.html';
}

function switchTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Deactivate all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activate selected tab
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    
    // Load tab content if needed
    if (tabId === 'leaderboard') {
        loadLeaderboard();
    } else if (tabId === 'userManagement') {
        loadUsersTable();
    }
}

function loadPageContent() {
    if (!currentUser) return;
    
    switch(currentUser.role) {
        case 'admin':
            loadAdminContent();
            break;
        case 'idol':
            loadIdolContent();
            break;
        case 'voter':
            loadVoterContent();
            break;
    }
}

function loadAdminContent() {
    // Load default tab content
    loadVoteManagement();
}

function loadVoteManagement() {
    // In a real app, you would fetch this from your database
    document.getElementById('maxVotes').value = 1; // Default value
}

function saveMaxVotes() {
    const maxVotes = document.getElementById('maxVotes').value;
    // In a real app, you would save this to your database
    alert(`Maksimal vote per user diset ke ${maxVotes}`);
}

function loadLeaderboard() {
    // In a real app, you would fetch idols data from your database
    const leaderboardContainer = document.getElementById('leaderboardContainer');
    leaderboardContainer.innerHTML = '<p>Memuat leaderboard...</p>';
    
    // Simulate API call
    setTimeout(() => {
        const mockIdols = [
            { id: 1, kelas: 'XI-1', kelompok: '1', nama: 'Kelompok 1', vote_count: 15 },
            { id: 2, kelas: 'XI-1', kelompok: '2', nama: 'Kelompok 2', vote_count: 10 },
            { id: 3, kelas: 'XI-2', kelompok: '1', nama: 'Kelompok 1', vote_count: 8 }
        ];
        
        let html = '<table><thead><tr><th>Peringkat</th><th>Kelas</th><th>Kelompok</th><th>Nama</th><th>Vote</th></tr></thead><tbody>';
        
        mockIdols.sort((a, b) => b.vote_count - a.vote_count)
            .forEach((idol, index) => {
                html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${idol.kelas}</td>
                        <td>${idol.kelompok}</td>
                        <td>${idol.nama}</td>
                        <td>${idol.vote_count}</td>
                    </tr>
                `;
            });
        
        html += '</tbody></table>';
        leaderboardContainer.innerHTML = html;
    }, 500);
}

function loadUsersTable() {
    // In a real app, you would fetch users data from your database
    const usersTable = document.querySelector('#usersTable tbody');
    usersTable.innerHTML = '<tr><td colspan="5">Memuat data user...</td></tr>';
    
    // Simulate API call
    setTimeout(() => {
        const mockUsers = [
            { username: 'admin1', role: 'admin', kelas: '', kelompok: '' },
            { username: 'voter1', role: 'voter', kelas: 'XI-1', kelompok: '' },
            { username: 'idol1', role: 'idol', kelas: 'XI-1', kelompok: '1' }
        ];
        
        let html = '';
        mockUsers.forEach(user => {
            html += `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.role}</td>
                    <td>${user.kelas || '-'}</td>
                    <td>${user.kelompok || '-'}</td>
                    <td>
                        <button class="btn">Edit</button>
                        <button class="btn" style="background-color: #e74c3c;">Hapus</button>
                    </td>
                </tr>
            `;
        });
        
        usersTable.innerHTML = html;
    }, 500);
}

function loadIdolContent() {
    // In a real app, you would fetch idol's own data from your database
    const idolProfile = document.getElementById('idolProfile');
    idolProfile.innerHTML = '<p>Memuat profil...</p>';
    
    // Simulate API call
    setTimeout(() => {
        const mockIdol = {
            id: 1,
            kelas: 'XI-1',
            kelompok: '1',
            nama: 'Kelompok 1',
            deskripsi: 'Ini adalah deskripsi kelompok kami.',
            foto_url: 'https://via.placeholder.com/300',
            vote_count: 15
        };
        
        // Pre-fill the form
        document.getElementById('idolNama').value = mockIdol.nama;
        document.getElementById('idolDeskripsi').value = mockIdol.deskripsi;
        document.getElementById('idolFoto').value = mockIdol.foto_url;
        
        // Display profile
        idolProfile.innerHTML = `
            <div class="idol-card">
                <img src="${mockIdol.foto_url}" alt="${mockIdol.nama}" class="idol-image">
                <div class="idol-info">
                    <span class="idol-class">${mockIdol.kelas} - Kelompok ${mockIdol.kelompok}</span>
                    <h3>${mockIdol.nama}</h3>
                    <p>${mockIdol.deskripsi}</p>
                    <p><strong>Total Vote:</strong> ${mockIdol.vote_count}</p>
                </div>
            </div>
        `;
    }, 500);
}

function updateIdolProfile(e) {
    e.preventDefault();
    
    const nama = document.getElementById('idolNama').value;
    const deskripsi = document.getElementById('idolDeskripsi').value;
    const foto_url = document.getElementById('idolFoto').value;
    
    // In a real app, you would send this data to your database
    alert('Profil berhasil diperbarui!');
    loadIdolContent(); // Refresh the profile display
}

function loadVoterContent() {
    // Load idols data
    loadIdols();
}

function loadIdols() {
    const idolsContainer = document.getElementById('idolsContainer');
    idolsContainer.innerHTML = '<p>Memuat data idol...</p>';
    
    // Simulate API call
    setTimeout(() => {
        const mockIdols = [
            { id: 1, kelas: 'XI-1', kelompok: '1', nama: 'Kelompok 1', deskripsi: 'Deskripsi kelompok 1', foto_url: 'https://via.placeholder.com/300?text=Kelompok+1', vote_count: 15 },
            { id: 2, kelas: 'XI-1', kelompok: '2', nama: 'Kelompok 2', deskripsi: 'Deskripsi kelompok 2', foto_url: 'https://via.placeholder.com/300?text=Kelompok+2', vote_count: 10 },
            { id: 3, kelas: 'XI-2', kelompok: '1', nama: 'Kelompok 1', deskripsi: 'Deskripsi kelompok 1 XI-2', foto_url: 'https://via.placeholder.com/300?text=Kelompok+1+XI2', vote_count: 8 },
            { id: 4, kelas: 'XI-2', kelompok: '2', nama: 'Kelompok 2', deskripsi: 'Deskripsi kelompok 2 XI-2', foto_url: 'https://via.placeholder.com/300?text=Kelompok+2+XI2', vote_count: 12 }
        ];
        
        displayIdols(mockIdols);
    }, 500);
}

function displayIdols(idols) {
    const idolsContainer = document.getElementById('idolsContainer');
    let html = '';
    
    idols.forEach(idol => {
        const hasVoted = currentUser.has_voted === true;
        
        html += `
            <div class="idol-card">
                <img src="${idol.foto_url}" alt="${idol.nama}" class="idol-image">
                <div class="idol-info">
                    <span class="idol-class">${idol.kelas} - Kelompok ${idol.kelompok}</span>
                    <h3>${idol.nama}</h3>
                    <p>${idol.deskripsi}</p>
                    <p><strong>Vote:</strong> ${idol.vote_count}</p>
                </div>
                <button class="vote-btn" data-idol-id="${idol.id}" ${hasVoted ? 'disabled' : ''}>
                    ${hasVoted ? 'Sudah Vote' : 'Vote'}
                </button>
            </div>
        `;
    });
    
    idolsContainer.innerHTML = html;
    
    // Add event listeners to vote buttons
    document.querySelectorAll('.vote-btn:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', function() {
            const idolId = this.getAttribute('data-idol-id');
            handleVote(idolId);
        });
    });
}

function handleVote(idolId) {
    // In a real app, you would send this vote to your database
    alert(`Terima kasih telah memvote idol dengan ID ${idolId}`);
    
    // Mark user as voted
    currentUser.has_voted = true;
    localStorage.setItem('pollingUser', JSON.stringify(currentUser));
    
    // Disable all vote buttons
    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.disabled = true;
        btn.textContent = 'Sudah Vote';
    });
}

function filterIdolsByClass() {
    const selectedClass = document.getElementById('kelasSelect').value;
    
    // In a real app, you would fetch filtered data from your database
    // Here we'll simulate filtering
    
    const mockIdols = [
        { id: 1, kelas: 'XI-1', kelompok: '1', nama: 'Kelompok 1', deskripsi: 'Deskripsi kelompok 1', foto_url: 'https://via.placeholder.com/300?text=Kelompok+1', vote_count: 15 },
        { id: 2, kelas: 'XI-1', kelompok: '2', nama: 'Kelompok 2', deskripsi: 'Deskripsi kelompok 2', foto_url: 'https://via.placeholder.com/300?text=Kelompok+2', vote_count: 10 },
        { id: 3, kelas: 'XI-2', kelompok: '1', nama: 'Kelompok 1', deskripsi: 'Deskripsi kelompok 1 XI-2', foto_url: 'https://via.placeholder.com/300?text=Kelompok+1+XI2', vote_count: 8 },
        { id: 4, kelas: 'XI-2', kelompok: '2', nama: 'Kelompok 2', deskripsi: 'Deskripsi kelompok 2 XI-2', foto_url: 'https://via.placeholder.com/300?text=Kelompok+2+XI2', vote_count: 12 }
    ];
    
    const filteredIdols = selectedClass === 'all' 
        ? mockIdols 
        : mockIdols.filter(idol => idol.kelas === selectedClass);
    
    displayIdols(filteredIdols);
}
