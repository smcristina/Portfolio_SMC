const express = require('express');
const router = express.Router();
const pool = require('../db');

//LISTA PRODOTTI
router.get('/catalogoProdotti', (req, res) => {
  console.log('Richiesta per la lista dei prodotti ricevuta');
  res.json({message: 'Lista prodotti'});
}); 

//Creazione prodotto
router.post('/creazioneProdotto', (req, res) => {
  res.json({message: 'Creazione prodotto avvenuta con successo!'});
});

//MODICA PRODOTTO
router.put('/:id', (req, res) => {
  res.json({message: 'Modifica prodotto avvenuta con successo!'});
});

//ELIMINAZIONE PRODOTTO
router.delete('/:id', (req, res) => {
  res.json({message: 'Eliminazione prodotto avvenuta con successo!'});
});


module.exports = router;