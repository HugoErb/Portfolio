// Charge les variables d'environnement depuis le fichier .env
require('dotenv').config();

// Importation des modules nécessaires
const express = require('express');               // Framework web pour gérer les requêtes HTTP
const sgMail = require('@sendgrid/mail');         // SDK SendGrid pour l'envoi d'e-mails
const cors = require('cors');                     // Middleware pour gérer les CORS
const rateLimit = require('express-rate-limit');  // Middleware pour limiter le nombre de requêtes

// Port d'écoute du serveur (par défaut 3002)
const PORT = process.env.PORT || 3002;

// Configuration de SendGrid avec la clé API
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Initialisation de l'application Express
const app = express();

// Analyse du corps des requêtes au format JSON
app.use(express.json());

// Limitation du nombre de requêtes sur l'endpoint /send-mail pour prévenir les abus
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // fenêtre de 24 heures
  max: 5,                       // maximum 5 requêtes par fenêtre par adresse IP
  message: "Trop de requêtes depuis cette IP, veuillez réessayer demain." // réponse en cas de dépassement
});
app.use('/send-mail', limiter);

// Configuration CORS : n'accepte que les requêtes POST depuis votre frontend
const corsOptions = {
  origin: process.env.NODE_ENV === 'dev'
    ? 'http://localhost:4200'        // en développement
    : 'https://hugoeribon.fr',      // en production
  methods: ['POST'],                // n'autoriser que la méthode POST
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Point de terminaison pour l'envoi d'e-mails
app.post('/send-mail', async (req, res) => {
  // Récupération des données envoyées depuis le formulaire
  const { name, email, phoneNumber, message } = req.body;

  // Vérification de la présence de tous les champs requis
  if (!name || !email || !phoneNumber || !message) {
    return res.status(400).json({ error: 'Champs manquants.' });
  }

  // Préparation du message à envoyer à l'administrateur
  const msgToMe = {
    to: process.env.SENDER_EMAIL,
    from: process.env.SENDER_EMAIL,
    replyTo: email, // l'utilisateur pourra répondre directement
    subject: `Nouveau message de ${name}`,
    text: `Nom : ${name}\nEmail : ${email}\nNuméro de tél : ${phoneNumber}\n\nMessage :\n${message}`
  };

  // Préparation du message de confirmation à l'utilisateur
  const msgToUser = {
    to: email,
    from: process.env.SENDER_EMAIL,
    subject: 'Eribon Hugo - Réception de votre message',
    text: "Bonjour !\n\nJ'ai bien reçu votre message. Je vais l'étudier attentivement et j'y répondrai dans les plus brefs délais.\nEn attendant, vous pouvez continuer de parcourir mon site internet, ou visiter mon Linkedin. Merci pour votre confiance !\n\nERIBON Hugo"
  };

  try {
    // Envoi simultané des deux e-mails (utilisateur et administrateur)
    await sgMail.send([msgToMe, msgToUser]);
    return res.status(200).json({ message: 'Emails envoyés avec succès.' });
  } catch (err) {
    // En cas d'erreur lors de l'envoi
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Service des fichiers statiques du frontend en production
if (process.env.NODE_ENV !== 'dev') {
  const distDir = __dirname + '/dist/';
  app.use(express.static(distDir));                // Sert les fichiers du dossier dist/
  app.get('*', (req, res) => {
    res.sendFile(distDir + 'index.html');          // Route toutes les requêtes vers index.html pour Angular
  });
}

// Démarrage du serveur Express
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
