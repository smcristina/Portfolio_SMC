const express = require('express');
const router = express.Router();
const pool = require('../db');

// Registra un pagamento
router.post('/', async (req, res) => {
  const { order_id, payment_method, status, payment_date } = req.body;

  if (!order_id || !payment_method || !status || !payment_date) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori!' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO payment (order_id, payment_method, status, payment_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [order_id, payment_method, status, payment_date]
    );

    res.status(201).json({
      message: 'Payment registered',
      payment: result.rows[0]
    });
  } catch (error) {
    console.error('Errore durante la registrazione del pagamento:', error);
    res.status(500).json({ message: 'Errore server nella registrazione del pagamento' });
  }
});

// Ottieni tutti i pagamenti
router.get('/payment', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payment');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Errore durante il recupero dei pagamenti:', error);
    res.status(500).json({ message: 'Errore durante il recupero dei pagamenti' });
  }
});

// Modifica un pagamento
router.put('/payment/:id', async (req, res) => {
  const { id } = req.params;
  const { payment_method, status, payment_date } = req.body;

  try {
    const result = await pool.query(
      `UPDATE payment
       SET payment_method = $1,
           status = $2,
           payment_date = $3
       WHERE id = $4
       RETURNING *`,
      [payment_method, status, payment_date, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Pagamento non trovato' });
    }

    res.status(200).json({ message: 'Pagamento aggiornato', payment: result.rows[0] });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del pagamento:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento del pagamento' });
  }
});

// Elimina un pagamento
router.delete('/payment/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM payment WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Pagamento non trovato' });
    }

    res.status(200).json({ message: 'Pagamento eliminato con successo' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione del pagamento:', error);
    res.status(500).json({ message: 'Errore durante l\'eliminazione del pagamento' });
  }
});

module.exports = router;

