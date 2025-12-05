const { Pool } = require('pg');  // Importa il modulo 'pg' per la connessione
require('dotenv').config(); // Importa dotenv per gestire le variabili d'ambiente

// Configurazione della connessione al database
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

// Verifico la connessione al database
pool.connect()
    .then(() => console.log('Connesso al database PostgreSQL'))
    .catch((err) => console.error('Errore di connessione al database', err));

// Esporto il pool per poterlo usare altrove nel progetto
module.exports = pool;
