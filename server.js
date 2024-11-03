require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const PORT = process.env.PORT || 3002;
const optionsCors = {
    maxHttpBufferSize: 1e9,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}

if (process.env.NODE_ENV === 'dev') {
    optionsCors.cors = {
        origin: 'http://localhost:4200/',
        methods: ["GET", "POST"]
    }
}

const app = express();
app.use(express.json());
app.use(cors(optionsCors));

app.post('/send-mail', async (req, res) => {
    // On extrait les valeurs en fonction de l'ordre attendu
    const [name, email, phoneNumber, message] = Object.values(req.body);

    // Vérification que les valeurs nécessaires sont présentes
    if (!name || !email || !phoneNumber || !message) {
        return res.status(400).json({ error: 'Certaines valeurs nécessaires sont manquantes.' });
    }

    // Fonction pour préparer les options d'envoi d'email
    const prepareMailOptions = (from, to, subject, text) => ({
        from,
        to,
        subject,
        text,
    });

    // Préparer les emails
    const mailOptions = prepareMailOptions(
        email,
        'eribon.hugo@gmail.com',
        `Nouveau message de ${name}`,
        `Nom : ${name}\nEmail : ${email}\nNuméro de tél : ${phoneNumber}\n\nMessage : ${message}`
    );

    const mailOptionsConfirmation = prepareMailOptions(
        'eribon.hugo@gmail.com',
        email,
        `Eribon Hugo - Réception de votre message`,
        `Bonjour !\n\nJ'ai bien reçu votre message. Je vais l'étudier attentivement et j'y répondrai dans les plus brefs délais.\nEn attendant, vous pouvez continuer de parcourir mon site internet, ou visiter mon Linkedin. Merci pour votre confiance !\n\nERIBON Hugo`
    );

    try {
        // Envoyer le premier email
        const info = await transporter.sendMail(mailOptions);

        // Si le premier email est envoyé avec succès, envoyer le deuxième email
        const infoConfirmation = await transporter.sendMail(mailOptionsConfirmation);

        res.status(200).json({
            message: 'Emails envoyés avec succès !',
            info: info,
            infoConfirmation: infoConfirmation,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

if (process.env.NODE_ENV !== 'dev') {
    var distDir = __dirname + "/dist/";
    app.use(express.static(distDir));

    app.get('*', (req, res) => {
        res.sendFile(__dirname + '/dist/index.html');
    });
}
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
