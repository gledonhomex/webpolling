// Fungsi untuk load user management table
async function loadUsersTable() {
    const users = await getAllUsers();
    const usersTable = document.querySelector('#usersTable tbody');
    
    let html = '';
    users.forEach(user => {
        html += `
            <tr>
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>${user.kelas || '-'}</td>
                <td>${user.kelompok || '-'}</td>
                <td>
                    <button class="btn delete-user" data-username="${user.username}" style="background-color: #e74c3c;">Hapus</button>
                </td>
            </tr>
        `;
    });
    
    usersTable.innerHTML = html;
    
    // Event listener untuk tombol hapus
    document.querySelectorAll('.delete-user').forEach(btn => {
        btn.addEventListener('click', async function() {
            const username = this.getAttribute('data-username');
            if (confirm(`Yakin ingin menghapus user ${username}?`)) {
                const result = await deleteUser(username);
                if (result.success) {
                    alert('User berhasil dihapus');
                    loadUsersTable();
                } else {
                    alert('Gagal menghapus user: ' + (result.error || 'Unknown error'));
                }
            }
        });
    });
}

// Fungsi untuk menampilkan idol (versi voter tanpa vote count)
async function displayIdols(idols) {
    const idolsContainer = document.getElementById('idolsContainer');
    let html = '';
    
    idols.forEach(idol => {
        const hasVoted = currentUser?.has_voted === true;
        
        html += `
            <div class="idol-card">
                <img src="${idol.foto_url}" alt="${idol.nama}" class="idol-image">
                <div class="idol-info">
                    <span class="idol-class">${idol.kelas} - Kelompok ${idol.kelompok}</span>
                    <h3>${idol.nama}</h3>
                    <p>${idol.deskripsi}</p>
                </div>
                <button class="vote-btn" data-idol-id="${idol.id}" ${hasVoted ? 'disabled' : ''}>
                    ${hasVoted ? 'Sudah Vote' : 'Vote'}
                </button>
            </div>
        `;
    });
    
    idolsContainer.innerHTML = html;
    
    // Event listener untuk tombol vote
    document.querySelectorAll('.vote-btn:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', function() {
            const idolId = this.getAttribute('data-idol-id');
            handleVote(idolId);
        });
    });
}

// Fungsi untuk load data voter
async function loadVoterContent() {
    const idols = await getIdols(true); // true untuk versi voter
    displayIdols(idols);
}
