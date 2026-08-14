// Importation des modules nécessaires
const express = require('express'); // Framework web pour servir le frontend
const path = require('path');       // Utilitaires de chemins compatibles avec l'OS

// Port d'écoute du serveur (par défaut 3002)
const PORT = process.env.PORT || 3002;

// Initialisation de l'application Express
const app = express();

// Service des fichiers statiques du frontend en production
if (process.env.NODE_ENV !== 'dev') {
    const distDir = path.join(__dirname, 'dist', 'browser');

    const sendPage = (page) => (req, res) => {
        res.setHeader('Cache-Control', 'no-cache');
        res.sendFile(path.join(distDir, page, 'index.html'));
    };

    app.get('/home', sendPage('home'));
    app.get('/legal-information', sendPage('legal-information'));

    app.use(express.static(distDir, {
        setHeaders: (res, filePath) => {
            if (/-[A-Z0-9]{8}\.(?:js|css)$/.test(filePath)) {
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }
        }
    }));

    app.get('*', (req, res) => {
        res.setHeader('Cache-Control', 'no-cache');
        res.sendFile(path.join(distDir, 'index.html'));
    });
}

// Démarrage du serveur Express
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
