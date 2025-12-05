
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Importa il pool di connessione al database
const bcrypt = require('bcrypt'); // Importa bcrypt per la crittografia delle password
const jtoken = require('jsonwebtoken'); // Importa jsonwebtoken per la gestione dei token JWT
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config(); // Importa dotenv per gestire le variabili d'ambiente



//registrazione
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log('Dati ricevuti:', req.body);

  if (!name || !email || !password || !role) {
    //controllo se i campi sono vuoti, se vuoti ritorna errore
    console.log('Errore: campi mancanti');
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori!' });
  }

  res.status(200).json({ message: 'Registrazione completata' });

try{
  //verifica se l'utente è già registrato
  const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (userExists.rows.length > 0) {
    console.log('Errore: l\'utente esiste già');
    return res.status(400).json({ message: 'L\'utente esiste già!' });
  }
  
  //hash della password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  //inserimento nel database
  const newUser = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, hashedPassword, role]
  );

  const newUserId = newUser.rows;

  //creazione del token
  const token = jtoken.sing(
    { id : newUser.id ,
      email : newUserId.email,
      role : newUserId.role 
    },
    JWT_SECRET,
    { expiresIn: '1h' } //tempo di scadenza del token '1 ora'
  );

  res.status(201).json({
    message: 'Registrazione completata',
    token: token,
    user: {
      id: newUserId.id,
      name: newUserId.name,
      email: newUserId.email,
      role: newUserId.role
    }
  });

}catch (error) {
  console.error('Errore durante la registrazione:', error);
  res.status(500).json({ message: 'Errore server durante la registrazione' });
}
});

//LOGIN 
router.post('/login', async (req, res) => {
  const{email, password} = req.body;
  console.log('Dati ricevuti:', req.body);

if(!email || !password) {
  console.log("Campi obbligatori!");
  return res.status(400).json({ message: 'Tutti i campi sono obbligatori!' });
}

res.status(200).json({ message: 'Login completato' });

try{

  //creo utente nel db
  const user = await pool.query('SLECT + FORM users WHERE email = $1',
    [email]
  );

  if(user.rows.length === 0){
    return res.status(401).json({message: 'Credenziali non valide!'}); 
  }

  const userResult = user.rows[0];

  //verifico la password
  const isPasswordValid = await bcrypt.compare(password, userResult.password);
  if(!isPasswordValid){
    return res.status(401).json({message: 'Credenziali non valide!'});
  }

  //creo il token
  const token = jtoken.sign(
    { id: userResult.id,
      email: userResult.email,
      role: userResult.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } //tempo di scadenza del token '1 ora'
  );

  res.status(200).json({
    message: 'Login effettuato con successo',
    token: token,
    user: {
      id: userResult.id,
      name: userResult.name,
      email: userResult.email,
      role: userResult.role
    }
  });

}catch (error) {
  console.error('Errore durante il login:', error);
  res.status(500).json({ message: 'Errore server durante il login' });

}
});


//logout  
router.post('/logout', async (req, res) => {
  console.log('Logout effettuato con successo!');
  res.status(200).json({ message: 'Logout effettuato con successo!' });
});

//recupero password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log('Dati ricevuti:', req.body);

  if (!email) {
    console.log('Errore: campo email mancante');
    return res.status(400).json({ message: 'Il campo email è obbligatorio!' });
  }

  res.status(200).json({ message: 'Email per il recupero password inviata' });

  try{
    //verifica se l'email esiste nel db
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      
      return res.status(200).json({ message: 'Se l\'email è registrata, riceverai le istruzioni per il recupero' });
    }

    //funzione per inviare l'email di recupero
    // Genera un token di reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 ora

    // Salva il token e la scadenza nel database (puoi aggiungere colonne reset_token e reset_token_expires nella tabella users)
    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
      [resetToken, resetTokenExpires, email]
    );

    // Configura il trasportatore nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Crea il link per il reset della password
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Opzioni email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recupero password',
      text: `Clicca sul seguente link per reimpostare la tua password: ${resetLink}`
    };

    // Invia l'email
    await transporter.sendMail(mailOptions);

    
  }catch (error) {
    console.error('Errore durante il recupero password:', error);
    res.status(500).json({ message: 'Errore server durante il recupero password' });
  }
});

module.exports = router;