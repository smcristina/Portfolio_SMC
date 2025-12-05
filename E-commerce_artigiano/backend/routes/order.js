const express = require('express');
const router = express.Router();
const pool = require('../db'); // Connessione al database

// === ORDINI ===


//===
// POST /Order - Crea un nuovo ordine (aggiungi al carrello)
router.post('/Order', async (req, res) => {
  const { user_id, product_id, quantity = 1 } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({ message: 'user_id e product_id sono obbligatori' });
  }

  const client = await pool.connect();

  try {
    const userResult = await client.query(
      'SELECT * FROM users WHERE id = $1 AND role = $2',
      [user_id, 'cliente']
    );
    if (userResult.rows.length === 0) {
      return res.status(403).json({ message: 'Accesso negato: utente non trovato o non autorizzato' });
    }

    await client.query('BEGIN');

    const productResult = await client.query(
      'SELECT id, price, quantity_in_stock FROM products WHERE id = $1',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      throw new Error(`Prodotto con ID ${product_id} non trovato`);
    }

    const product = productResult.rows[0];

    if (product.quantity_in_stock < quantity) {
      throw new Error(`Quantità insufficiente per il prodotto ID ${product_id}. Disponibili: ${product.quantity_in_stock}`);
    }

    const total_price = product.price * quantity;
    const price_at_order = product.price;

    const orderResult = await client.query(
      'INSERT INTO order (user_id, product_id, quantity, total_price, price_at_order, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
      [user_id, product_id, quantity, total_price, price_at_order]
    );

    await client.query(
      'UPDATE products SET quantity_in_stock = quantity_in_stock - $1 WHERE id = $2',
      [quantity, product_id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Prodotto aggiunto al carrello con successo',
      order: orderResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore durante l\'aggiunta al carrello:', error);
    res.status(500).json({ message: `Errore: ${error.message}` });
  } finally {
    client.release();
  }
});

//===2
// GET /Order/:user_id - Lista ordini di un cliente
router.get('/Order/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    // Verifica che l'utente sia un cliente
    const clientVerify = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND role = $2',
      [user_id, 'cliente']
    );
    if (clientVerify.rows.length === 0) {
      return res.status(403).json({ message: 'Accesso negato: l\'utente non è un cliente' });
    }

    // Ottieni tutti gli ordini dell'utente con informazioni sui prodotti
    const ordersResult = await pool.query(
      `SELECT o.*, p.title, p.image_url 
       FROM order o
       JOIN products p ON o.product_id = p.id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [user_id]
    );

    res.status(200).json({
      message: 'Ordini recuperati con successo',
      orders: ordersResult.rows
    });
  } catch (error) {
    console.error('Errore nel recupero ordini:', error);
    res.status(500).json({ message: 'Errore durante il recupero degli ordini' });
  }
});


//===3
// GET /orders/artisan/:artisanId - Lista ordini ricevuti da un artigiano
router.get('/Order/artisan/:artisan_id', async (req, res) => {
  const { artisan_id } = req.params;

  try {
    // Verifica che l'utente sia un artigiano
    const artisanVerify = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND role = $2',
      [id, 'artigiano']
    );
    
    if (artisanVerify.rows.length === 0) {
      return res.status(403).json({ message: 'Accesso negato: l\'utente non è un artigiano' });
    }
    
    // Recupera gli ordini ricevuti dall'artigiano
    const artisanOrders = await pool.query(
      `SELECT o.*, p.title, u.name AS customer_name
       FROM order o
       JOIN products p ON o.product_id = p.id
       JOIN users u ON o.user_id = u.id
       WHERE p.artigiano_id = $1
       ORDER BY o.created_at DESC`,
      [id]
    );
    
    if (artisanOrders.rows.length === 0) {
      return res.status(200).json({ message: 'Nessun ordine trovato per questo artigiano', orders: [] });
    }
    
    res.status(200).json({
      message: 'Ordini ricevuti con successo',
      orders: artisanOrders.rows
    });
  } catch (error) {
    console.error('Errore nel recupero ordini artigiano:', error);
    res.status(500).json({ message: 'Errore durante il recupero degli ordini' });
  }
});

//===4===
// GET /orders/:orderId - Dettagli di un ordine
router.get('/Order/:id', async (req, res) => {
  const {i } = req.params;

  try {
    const orderResult = await pool.query(
      `SELECT o.*, p.title, p.description, p.image_url
       FROM order o
       JOIN products p ON o.product_id = p.id
       WHERE o.id = $1`,
      [id]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Ordine non trovato' });
    }
    
    res.status(200).json({
      message: 'Dettagli ordine recuperati con successo',
      order: orderResult.rows[0]
    });
  } catch (error) {
    console.error('Errore nel recupero ordine:', error);
    res.status(500).json({ message: 'Errore durante il recupero dell\'ordine' });
  }
});


//===5===
// PUT /orders/:order_id - Aggiorna quantità di un ordine
router.put('/orders/:order_id', async (req, res) => {
  const { order_id } = req.params;
  const { quantity } = req.body;
  
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Quantità non valida' });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Ottieni informazioni sull'ordine e sul prodotto
    const orderResult = await client.query(
      `SELECT o.*, p.price, p.quantity_in_stock 
       FROM order o
       JOIN products p ON o.product_id = p.id
       WHERE o.id = $1`,
      [order_id]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Ordine non trovato' });
    }
    
    const order = orderResult.rows[0];
    const diff = quantity - order.quantity;
    
    // Verifica disponibilità se aumentiamo la quantità
    if (diff > 0 && order.quantity_in_stock < diff) {
      return res.status(400).json({ message: 'Quantità insufficiente. Disponibili: ${order.quantity_in_stock} '});
    }
    
    // Aggiorna la quantità e il prezzo totale nell'ordine
    const updateOrderResult = await client.query(
      'UPDATE order SET quantity = $1, total_price = $2 WHERE id = $3 RETURNING *',
      [quantity, order.price * quantity, order_id]
    );
    
    // Aggiorna la quantità in stock del prodotto
    await client.query(
      'UPDATE products SET quantity_in_stock = quantity_in_stock - $1 WHERE id = $2',
      [diff, order.product_id]
    );
    
    await client.query('COMMIT');
    
    res.status(200).json({
      message: 'Ordine aggiornato con successo',
      order: updateOrderResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore aggiornamento ordine:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento dell\'ordine' });
  } finally {
    client.release();
  }
});

//===6===

// DELETE /orders/:orderId - Rimuovi un ordine (rimuovi dal carrello)
router.delete('/order/:id', async (req, res) => {
  const { id } = req.params;
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Ottieni informazioni sull'ordine per ripristinare lo stock
    const orderResult = await client.query(
      'SELECT product_id, quantity FROM order WHERE id = $1',
      [id]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Ordine non trovato' });
    }
    
    const order = orderResult.rows[0];
    
    // Ripristina la quantità in stock
    await client.query(
      'UPDATE products SET quantity_in_stock = quantity_in_stock + $1 WHERE id = $2',
      [order.quantity, order.product_id]
    );
    
    // Elimina l'ordine
    await client.query('DELETE FROM order WHERE id = $1', [id]);
    
    await client.query('COMMIT');
    
    res.status(200).json({ message: 'Ordine eliminato con successo' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore eliminazione ordine:', error);
    res.status(500).json({ message: 'Errore durante l\'eliminazione dell\'ordine' });
  } finally {
    client.release();
  }
});

//===7===
// POST /orders/checkout - Esegue il checkout degli ordini (pagamento)
router.post('/order/checkout', async (req, res) => {
  const { user_id, order_ids, payment_method } = req.body;

  if (!user_id || !Array.isArray(order_ids) || order_ids.length === 0 || !payment_method) {
    return res.status(400).json({ message: 'user_id, order_ids e payment_method sono obbligatori' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [user_id]
    );
    if (userResult.rows.length === 0) {
      return res.status(403).json({ message: 'Utente non trovato' });
    }

    const ordersResult = await client.query(
      'SELECT * FROM orders WHERE id = ANY($1::int[])',
      [order_ids]
    );
    if (ordersResult.rows.length === 0) {
      return res.status(404).json({ message: 'Nessun ordine trovato' });
    }

    const invalidOrders = ordersResult.rows.filter(order => order.user_id !== parseInt(user_id));
    if (invalidOrders.length > 0) {
      return res.status(403).json({ message: 'Alcuni ordini non appartengono all\'utente' });
    }

    const totalAmount = ordersResult.rows.reduce((sum, order) => sum + parseFloat(order.total_price), 0);

    const paymentResult = await client.query(
      'INSERT INTO payment (order_id, payment_method, status, payment_date) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [order_ids[0], payment_method, 'completato'] // Assumiamo che il pagamento sia per il primo ordine
    );

    await client.query('COMMIT');

    res.status(200).json({
      message: 'Checkout completato con successo',
      payment: paymentResult.rows[0],
      total_amount: totalAmount
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore durante il checkout:', error);
    res.status(500).json({ message: `Errore: ${error.message}` });
  } finally {
    try {
      client.release();
    } catch (releaseError) {
      console.error('Errore nel rilascio del client:', releaseError);
    }
  }
});


//===8===

// GET /sales/artisan/:artisanId - Statistiche vendite per artigiano
router.get('/sales/artisan/:artisan_id', async (req, res) => {
  const { artisan_id } = req.params;
  
  try {
    // Verifica che l'utente sia un artigiano
    const artisanVerify = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND role = $2',
      [artisan_id, 'artigiano']
    );
    
    if (artisanVerify.rows.length === 0) {
      return res.status(403).json({ message: 'Accesso negato: l\'utente non è un artigiano' });
    }
    
    // Recupera statistiche di vendita
    const salesStats = await pool.query(
      `SELECT 
         p.id, 
         p.title, 
         COUNT(o.id) AS num_orders, 
         SUM(o.quantity) AS total_quantity_sold,
         SUM(o.total_price) AS total_revenue
       FROM products p
       LEFT JOIN order o ON p.id = o.product_id
       WHERE p.artigiano_id = $1
       GROUP BY p.id, p.title
       ORDER BY total_revenue DESC NULLS LAST`,
      [artisan_id]
    );
    
    res.status(200).json({
      message: 'Statistiche vendite recuperate con successo',
      sales_statistics: salesStats.rows
    });
  } catch (error) {
    console.error('Errore nel recupero statistiche vendite:', error);
    res.status(500).json({ message: 'Errore durante il recupero delle statistiche vendite' });
  }
});

module.exports = router;