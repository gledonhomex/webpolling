const scriptUrl = 'https://script.google.com/macros/s/AKfycbxq48ppMoXOAL5fYYn3ybbqLtmy2j4WW3BPLvSaKcBTQcDdC02DqFDNwhtF9Jv2ENJ-Gw/exec';

// Fungsi untuk mendapatkan semua user
async function getAllUsers() {
    return await getSheetData('users');
}

// Fungsi untuk menambah user
async function addUser(userData) {
    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sheet: 'users',
                action: 'add',
                data: userData
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error adding user:', error);
        return { success: false, error: error.message };
    }
}

// Fungsi untuk menghapus user
async function deleteUser(username) {
    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sheet: 'users',
                action: 'delete',
                data: { username }
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, error: error.message };
    }
}

// Fungsi untuk mendapatkan data idol (versi voter tanpa vote count)
async function getIdols(forVoter = false) {
    const idols = await getSheetData('idols');
    
    if (forVoter) {
        return idols.map(idol => {
            const { vote_count, ...rest } = idol;
            return rest;
        });
    }
    
    return idols;
}

export {
    getAllUsers,
    addUser,
    deleteUser,
    getIdols,
    // ... fungsi lainnya yang sudah ada
};
