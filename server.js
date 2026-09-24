const crypto = require('crypto');
const express = require('express');
const path = require('path');
const { rateLimit } = require('express-rate-limit');
const { Resend } = require('resend');

const PORT = process.env.PORT || 3002;
const isProduction = process.env.NODE_ENV === 'production';
const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (isProduction) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Trop de demandes. Réessayez dans quelques minutes.' },
});

const isString = (value) => typeof value === 'string';
const clean = (value) => value.trim().replace(/\r?\n/g, ' ');
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
const getAllowedOrigin = (req) => `${isProduction ? 'https' : req.protocol}://${req.get('host')}`;

app.post('/api/contact', express.json({ limit: '10kb', type: 'application/json' }), contactLimiter, async (req, res) => {
    const origin = req.get('origin');
    const allowedOrigin = isProduction ? (process.env.SITE_ORIGIN || 'https://hugoeribon.fr') : getAllowedOrigin(req);
    if (!allowedOrigin) return res.status(503).json({ message: 'Le formulaire est momentanément indisponible.' });
    if (!origin || origin !== allowedOrigin.replace(/\/$/, '')) return res.status(403).json({ message: 'Requête non autorisée.' });

    const { name, email, phone, message, website } = req.body ?? {};
    if (!isString(name) || !isString(email) || !isString(message) || (phone !== undefined && !isString(phone)) || (website !== undefined && !isString(website))) {
        return res.status(400).json({ message: 'Les informations envoyées sont invalides.' });
    }

    const senderName = clean(name);
    const senderEmail = clean(email).toLowerCase();
    const senderPhone = phone ? clean(phone) : '';
    const senderMessage = message.trim();
    if (!senderName || senderName.length > 100 || !isValidEmail(senderEmail) || senderPhone.length > 30 || !/^[0-9+(). -]*$/.test(senderPhone) || senderMessage.length < 10 || senderMessage.length > 5000) {
        return res.status(400).json({ message: 'Vérifiez les informations du formulaire.' });
    }

    // Champ invisible : une soumission automatique reçoit une réponse neutre sans envoyer d’e-mail.
    if (website?.trim()) return res.status(202).json({ message: 'Votre message a bien été envoyé.' });

    const { RESEND_API_KEY, SENDER_EMAIL, ADMIN_EMAIL } = process.env;
    if (!RESEND_API_KEY || !SENDER_EMAIL || !ADMIN_EMAIL) {
        console.error('Configuration Resend incomplète.');
        return res.status(503).json({ message: 'Le formulaire est momentanément indisponible.' });
    }

    try {
        const resend = new Resend(RESEND_API_KEY);
        const { error: contactEmailError } = await resend.emails.send({
            from: SENDER_EMAIL,
            to: [ADMIN_EMAIL],
            replyTo: senderEmail,
            subject: `Nouveau message de ${senderName}`,
            text: `Nom : ${senderName}\nE-mail : ${senderEmail}${senderPhone ? `\nTéléphone : ${senderPhone}` : ''}\n\nMessage :\n${senderMessage}`,
            headers: { 'X-Entity-Ref-ID': crypto.randomUUID() },
        });

        if (contactEmailError) {
            console.error('Échec Resend :', contactEmailError.name ?? 'erreur inconnue');
            return res.status(502).json({ message: 'L’envoi du message a échoué. Réessayez plus tard.' });
        }

        const { error: acknowledgementError } = await resend.emails.send({
            from: SENDER_EMAIL,
            to: [senderEmail],
            replyTo: ADMIN_EMAIL,
            subject: 'Votre message a bien été reçu',
            text: `Bonjour ${senderName},\n\nJ’ai bien reçu votre message et vous remercie de m’avoir contacté. Je vais l’étudier et reviendrai vers vous dans les meilleurs délais.\n\nCordialement,\nHugo Eribon`,
            headers: { 'X-Entity-Ref-ID': crypto.randomUUID() },
        });
        if (acknowledgementError) {
            console.error('Échec de l’accusé de réception Resend :', acknowledgementError.name ?? 'erreur inconnue');
        }
        return res.status(202).json({ message: 'Votre message a bien été envoyé.' });
    } catch (error) {
        console.error('Erreur lors de l’envoi du message :', error instanceof Error ? error.message : 'erreur inconnue');
        return res.status(502).json({ message: 'L’envoi du message a échoué. Réessayez plus tard.' });
    }
});

if (process.env.NODE_ENV !== 'dev') {
    const distDir = path.join(__dirname, 'dist', 'browser');
    const sendPage = (page) => (req, res) => {
        res.setHeader('Cache-Control', 'no-cache');
        res.sendFile(path.join(distDir, page, 'index.html'));
    };
    app.get('/home', sendPage('home'));
    app.get('/legal-information', sendPage('legal-information'));
    app.use(express.static(distDir, { setHeaders: (res, filePath) => {
        if (/-[A-Z0-9]{8}\.(?:js|css)$/.test(filePath)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }}));
    app.get('/{*splat}', (req, res) => {
        res.setHeader('Cache-Control', 'no-cache');
        res.status(404).sendFile(path.join(distDir, 'index.html'));
    });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
