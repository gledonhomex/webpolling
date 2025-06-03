// Konfigurasi Google Apps Script
const scriptUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// Fungsi untuk mengambil data dari sheet
async function getSheetData(sheetName) {
    try {
        const response = await fetch(`${scriptUrl}?sheet=${sheetName}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(`Error fetching ${sheetName}:`, error);
        return [];
    }
}

// Fungsi untuk menyimpan data ke sheet
async function saveToSheet(sheetName, data) {
    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sheet: sheetName,
                data: data
            })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error saving to ${sheetName}:`, error);
        return { success: false, error: error.message };
    }
}

// Fungsi khusus untuk autentikasi
async function authenticateUser(username, password) {
    const users = await getSheetData('users');
    const user = users.find(u => u.username === username && u.password === password);
    return user ? { ...user } : null;
}

// Fungsi untuk mendapatkan data idol
async function getIdols() {
    return await getSheetData('idols');
}

// Fungsi untuk menyimpan vote
async function saveVote(voterUsername, idolId) {
    // Tambahkan record vote baru
    const voteData = {
        voter_username: voterUsername,
        idol_id: Number(idolId),
        timestamp: new Date().toISOString()
    };
    
    const voteResult = await saveToSheet('votes', voteData);
    
    if (voteResult.success) {
        // Update has_voted di users
        const users = await getSheetData('users');
        const userIndex = users.findIndex(u => u.username === voterUsername);
        
        if (userIndex !== -1) {
            users[userIndex].has_voted = true;
            // Di aplikasi nyata, Anda perlu mengupdate seluruh sheet
            // Ini adalah implementasi sederhana
            await saveToSheet('users', users[userIndex]);
        }
        
        // Update vote_count di idol
        const idols = await getSheetData('idols');
        const idolIndex = idols.findIndex(i => i.id === Number(idolId));
        
        if (idolIndex !== -1) {
            idols[idolIndex].vote_count = Number(idols[idolIndex].vote_count || 0) + 1;
            await saveToSheet('idols', idols[idolIndex]);
        }
    }
    
    return voteResult;
}

// Fungsi untuk update profil idol
async function updateIdolProfile(idolId, updatedData) {
    const idols = await getSheetData('idols');
    const idolIndex = idols.findIndex(i => i.id === Number(idolId));
    
    if (idolIndex !== -1) {
        const updatedIdol = { ...idols[idolIndex], ...updatedData };
        return await saveToSheet('idols', updatedIdol);
    }
    
    return { success: false, error: 'Idol not found' };
}

// Fungsi untuk mendapatkan data leaderboard
async function getLeaderboard() {
    const idols = await getSheetData('idols');
    return idols.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
}

export {
    getSheetData,
    saveToSheet,
    authenticateUser,
    getIdols,
    saveVote,
    updateIdolProfile,
    getLeaderboard
};
