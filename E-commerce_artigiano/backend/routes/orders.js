const express = require('express');
const router = express.Router();
const pool = require('../db'); // Importa il pool di connessione al database

//CREAZIONE ORDINE 
router.post('/', async (req, res) => {
  const { userId, productId, quantity, price_at_order} = req.body;
  console.log('Dati ricevuti:', req.body);

  if (!userId || !productId || !quantity || !price_at_order) {
    console.log('Errore: campi mancanti');
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori!' });
  }

  try {
    // Esegui la query per creare un nuovo ordine
    const result = await pool.query(
      'INSERT INTO orders (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [userId, productId, quantity]
    );
    const newOrder = result.rows[0];
    res.status(201).json({ message: 'Ordine creato con successo', order: newOrder });
  } catch (error) {
    console.error('Errore durante la creazione dell\'ordine:', error);
    res.status(500).json({ message: 'Errore durante la creazione dell\'ordine' });
  }
});

//LISTA ORDINI CLIENTE  
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log('ID utente ricevuto:', userId);

  try {
    // Esegui la query per ottenere gli ordini dell'utente
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1',
      [userId]
    );
    const orders = result.rows;
    res.status(200).json({ message: 'Lista ordini', orders });
  } catch (error) {
    console.error('Errore durante il recupero degli ordini:', error);
    res.status(500).json({ message: 'Errore durante il recupero degli ordini' });
  }
});

//LISTA ORDINI ARTIGIANO    
router.get('/artisan/:artisanId', async (req, res) => {
  const { artisanId } = req.params;
  console.log('ID artigiano ricevuto:', artisanId);

  try {
    // Esegui la query per ottenere gli ordini dell'artigiano
    const result = await pool.query(
      'SELECT * FROM orders WHERE artisan_id = $1',
      [artisanId]
    );
    const orders = result.rows;
    res.status(200).json({ message: 'Lista ordini', orders });
  } catch (error) {
    console.error('Errore durante il recupero degli ordini:', error);
    res.status(500).json({ message: 'Errore durante il recupero degli ordini' });
  }
});

//MODIFICA ORDINE       
router.put('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  console.log('ID ordine ricevuto:', orderId);

  if (!status) {
    console.log('Errore: campo status mancante');
    return res.status(400).json({ message: 'Il campo status è obbligatorio!' });
  }

  try {
    // Esegui la query per modificare lo stato dell'ordine
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, orderId]
    );
    const updatedOrder = result.rows[0];
    res.status(200).json({ message: 'Ordine modificato con successo', order: updatedOrder });
  } catch (error) {
    console.error('Errore durante la modifica dell\'ordine:', error);
    res.status(500).json({ message: 'Errore durante la modifica dell\'ordine' });
  }
});

module.exports = router;