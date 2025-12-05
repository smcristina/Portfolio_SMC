// app.js collegamento al server Express e alle rotte
const express = require('express');
const app = express();
const PORT = 3000;
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');  
//const ordersRoutes = require('./routes/orders'); 

/*// 1. Middleware per leggere JSON nel corpo delle richieste
app.use(express.json());

// 2. Importa le rotte (assicurati che il percorso sia corretto)
const authRoutes = require('./routes/api-routes');

// 3. Usa le rotte per /api/auth
app.use('/api/auth', authRoutes); */

app.use(express.json()); // Middleware per analizzare il corpo delle richieste JSON

app.use('/api/auth', authRoutes); // Rotte per l'autenticazione
app.use('/api/product', productRoutes); // Rotte per i prodotti
<<<<<<< HEAD
app.use('/api/order', require('./routes/order')); // Rotte per gli ordini

// avvio di prova del server
=======
app.use('/api/orders', require('./routes/orders')); // Rotte per gli ordini

>>>>>>> 3249e94 (aggiunta del backend)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Ciao dal backend di Artigianato Online!' });
});

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});

