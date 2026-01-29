const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || '204r8382394';
const BLACKLIST_FILE = path.join(__dirname, 'blacklist.json');

// Middleware
app.use(express.json());

// Load blacklist data
function loadBlacklist() {
    try {
        if (fs.existsSync(BLACKLIST_FILE)) {
            const data = fs.readFileSync(BLACKLIST_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('Error loading blacklist:', err);
    }
    return {};
}

// Save blacklist data
function saveBlacklist(data) {
    try {
        fs.writeFileSync(BLACKLIST_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error saving blacklist:', err);
    }
}

// Middleware to verify API key
function verifyApiKey(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Missing Authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (token !== API_KEY) {
        return res.status(403).json({ error: 'Invalid API key' });
    }

    next();
}

// Apply API key verification to all routes
app.use(verifyApiKey);

// GET - Check if player is blacklisted
app.get('/blacklist/:uuid', (req, res) => {
    const blacklist = loadBlacklist();
    const uuid = req.params.uuid.toLowerCase();

    if (blacklist[uuid]) {
        return res.status(200).json({
            blacklisted: true,
            data: blacklist[uuid]
        });
    }

    res.status(200).json({ blacklisted: false });
});

// POST - Add player to blacklist
app.post('/blacklist', (req, res) => {
    const { uuid, username, reason, expires } = req.body;

    if (!uuid || !username) {
        return res.status(400).json({ error: 'Missing required fields: uuid, username' });
    }

    const blacklist = loadBlacklist();
    const uuidLower = uuid.toLowerCase();

    const entry = {
        uuid: uuidLower,
        username: username,
        reason: reason || 'No reason provided',
        expires: expires || 'permanent',
        addedAt: new Date().toISOString(),
        addedBy: req.body.addedBy || 'Unknown'
    };

    blacklist[uuidLower] = entry;
    saveBlacklist(blacklist);

    console.log(`[BLACKLIST] Added: ${username} (${uuid})`);
    res.status(201).json({
        success: true,
        message: `${username} has been blacklisted`,
        data: entry
    });
});

// DELETE - Remove player from blacklist
app.delete('/blacklist/:uuid', (req, res) => {
    const blacklist = loadBlacklist();
    const uuid = req.params.uuid.toLowerCase();

    if (!blacklist[uuid]) {
        return res.status(404).json({ error: 'Player not found in blacklist' });
    }

    const removed = blacklist[uuid];
    delete blacklist[uuid];
    saveBlacklist(blacklist);

    console.log(`[UNBLACKLIST] Removed: ${removed.username} (${uuid})`);
    res.status(200).json({
        success: true,
        message: `${removed.username} has been removed from blacklist`,
        data: removed
    });
});

// GET - Get all blacklisted players
app.get('/blacklist', (req, res) => {
    const blacklist = loadBlacklist();
    const count = Object.keys(blacklist).length;

    res.status(200).json({
        total: count,
        players: blacklist
    });
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Blacklist API is running' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Blacklist API running on http://localhost:${PORT}`);
    console.log(`🔑 API Key: ${API_KEY}`);
    console.log(`📝 Blacklist file: ${BLACKLIST_FILE}`);
});
