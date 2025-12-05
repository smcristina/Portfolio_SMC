//definisco middleware per autenticazione 
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware per verificare il token JWT
const authenticateToken = (req, res, next) => {
  // 1. Estrai il token dall'header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token di accesso richiesto' });
  }

  // 2. Verifica il token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token non valido' });
    }

    // 3. Aggiungi i dati dell'utente alla richiesta
    req.user = decoded;
    next(); // Continua alla route successiva
  });
};

// Middleware per verificare ruoli specifici
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Utente non autenticato' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accesso negato: ruolo insufficiente' });
    }

    next();
  };
};

// Middleware per verificare che l'utente sia un artigiano
const requireArtisan = requireRole(['artigiano']);

// Middleware per verificare che l'utente sia un cliente
const requireCustomer = requireRole(['cliente']);

// Middleware per admin (se ne hai)
const requireAdmin = requireRole(['admin']);

module.exports = {
  authenticateToken,
  requireRole,
  requireArtisan,
  requireCustomer,
  requireAdmin
};