var fetch = require('node-fetch')
const express = require('express') 
const app = express() 
const config = require('./config.json')

const { url, apiKey } = config

headers = {
    'Authorization': apiKey
};

app.get('/getcustomerid/:document', async (req, res) => {
    let document = req.params.document
    await fetch(`${url}/customers?document=${document}`, { method: 'GET', headers: headers})
    .then(response => response.json())
    .then(response => {
        result = response.data
        
        if (result.length == 0)
          res.status(503).json({msg: "não encontrado"})
        else
          res.status(200).json({id: result[0].id})
      })
 })

 app.get('/gettoken/:customerid/:cardnumber/:month/:year/:cvv', async (req, res) => {
    let customerid = req.params.customerid

    body = JSON.stringify({
        number: req.params.cardnumber, 
        exp_month: req.params.month, 
        exp_year: req.params.year, 
        cvv: req.params.cvv 
    })

    await fetch(`${url}/customers/${customerid}/cards`, { method: 'POST', headers, body})
    .then(response => response.json())
    .then(response => {
        if(response.errors === undefined ){
            res.status(200).json({
              msg: "sucess", 
              last4: response.last_four_digits,
              brand: response.brand,
              valid_month: response.exp_month,
              valid_year: response.exp_year,
              token: response.id
          })
        }
        else
            res.status(503).json({msg: response.message})
      })
 })

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
   });
