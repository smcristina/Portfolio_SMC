// skills api di APIlayer
// limit request di 3000 mensile
// count è opzionale, di default sono 10

/*
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async(req, res)=>{
  const {q} = req.query;
  try{
    const options = {
      method: 'GET',
      url: 'https://api.apilayer.com/skills',
      params:{q},
      headers: {
        apikey: process.env.API_LAYER_KEY     
      }
  };

  const response = await axios.request(options)
  res.json(response.data);
  } catch (error) {
    console.error('Errore nella richiesta:', error.message);
    res.status(500).json({error: 'Errore durante la richiesta API'});
  }
});

module.exports = router;


//API_LAYER_KEY = tDSchlVrIaIkPqU5JvEFxIhYtapKCDmP   da inserire nel file env*/