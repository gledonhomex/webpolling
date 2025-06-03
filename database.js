// This file would contain functions to interact with Google Sheets as a database
// For now, we'll use mock data and functions

// Google Sheets API configuration
const scriptUrl = 'https://script.google.com/macros/s/AKfycbxq48ppMoXOAL5fYYn3ybbqLtmy2j4WW3BPLvSaKcBTQcDdC02DqFDNwhtF9Jv2ENJ-Gw/exec'; // You need to create this

// Function to fetch data from Google Sheets
async function fetchFromSheet(sheetName) {
    try {
        const response = await fetch(`${scriptUrl}?sheet=${sheetName}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to post data to Google Sheets
async function postToSheet(sheetName, data) {
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
        console.error('Error posting data:', error);
        return null;
    }
}

// Mock functions for development
async function mockFetchFromSheet(sheetName) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (sheetName === 'users') {
                resolve([
                    { username: 'admin1', password: 'admin123', role: 'admin', kelas: '', kelompok: '', has_voted: false },
                    { username: 'voter1', password: 'voter123', role: 'voter', kelas: 'XI-1', kelompok: '', has_voted: false },
                    { username: 'idol1', password: 'idol123', role: 'idol', kelas: 'XI-1', kelompok: '1', has_voted: false }
                ]);
            } else if (sheetName === 'idols') {
                resolve([
                    { id: 1, kelas: 'XI-1', kelompok: '1', nama: 'Kelompok 1', deskripsi: 'Deskripsi kelompok 1', foto_url: 'https://via.placeholder.com/300?text=Kelompok+1', vote_count: 15 },
                    { id: 2, kelas: 'XI-1', kelompok: '2', nama: 'Kelompok 2', deskripsi: 'Deskripsi kelompok 2', foto_url: 'https://via.placeholder.com/300?text=Kelompok+2', vote_count: 10 },
                    { id: 3, kelas: 'XI-2', kelompok: '1', nama: 'Kelompok 1', deskripsi: 'Deskripsi kelompok 1 XI-2', foto_url: 'https://via.placeholder.com/300?text=Kelompok+1+XI2', vote_count: 8 },
                    { id: 4, kelas: 'XI-2', kelompok: '2', nama: 'Kelompok 2', deskripsi: 'Deskripsi kelompok 2 XI-2', foto_url: 'https://via.placeholder.com/300?text=Kelompok+2+XI2', vote_count: 12 }
                ]);
            } else if (sheetName === 'votes') {
                resolve([
                    { voter_username: 'voter1', idol_id: 1, timestamp: '2023-11-01 10:00:00' }
                ]);
            } else {
                resolve([]);
            }
        }, 500);
    });
}

// Use mock functions for now
async function getSheetData(sheetName) {
    // In development, use mock data
    if (window.location.href.includes('replit.com') || window.location.href.includes('localhost')) {
        return await mockFetchFromSheet(sheetName);
    }
    // In production, use real Google Sheets API
    return await fetchFromSheet(sheetName);
}

async function saveSheetData(sheetName, data) {
    // In development, log to console
    if (window.location.href.includes('replit.com') || window.location.href.includes('localhost')) {
        console.log(`Saving to ${sheetName}:`, data);
        return { success: true };
    }
    // In production, use real Google Sheets API
    return await postToSheet(sheetName, data);
}
