var fetch = require('node-fetch')
const express = require('express') 
const app = express() 
const config = require('./config.json')

const { url, apiKey } = config

headers = {
    'Authorization': apiKey
};

app.get('/getcustomerid/:document', (req, res) => {
    let document = req.params.document
    fetch(`${url}/customers?document=${document}`, { method: 'GET', headers: headers})
    .then(response => response.json())
    .then(response => {
        result = response.data
        
        if (result.length == 0)
          res.status(503).send("NotFound")
        else
          res.status(200).send(result[0].id)
      })
 })

 app.get('/gettoken/:customerid/:cardnumber/:month/:year/:cvv', (req, res) => {
    let customerid = req.params.customerid

    body = JSON.stringify({
        number: req.params.cardnumber, 
        exp_month: req.params.month, 
        exp_year: req.params.year, 
        cvv: req.params.cvv 
    })

    fetch(`${url}/customers/${customerid}/cards`, { method: 'POST', headers, body})
    .then(response => response.json())
    .then(response => {
        if(response.errors === undefined ){
            res.status(200).send(`Success,${response.last_four_digits},${response.brand},${response.exp_month},${response.exp_year},${response.id}`)
        }
        else
            res.status(503).send(`${response.message},Erro ao gerar token. Dados do cartao Invalidos`)
      })
 })

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
   });
