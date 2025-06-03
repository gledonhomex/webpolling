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
                    // Hanya admin yang ada
                    { username: 'admin', password: 'admin123', role: 'admin', kelas: '', kelompok: '', has_voted: false }
                ]);
            } else {
                // Sheet lainnya kosong
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
