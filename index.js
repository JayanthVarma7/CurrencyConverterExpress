const express=require('express');
const app=express();
const PORT=8082;
const { getCurrencyList, convertCurrency } = require("./controllers/currencies.controller");


app.use(express.json()); // Note: needed for req.body to work in post

app.listen(PORT,()=>{console.log("Listening at Port:"+PORT)});

app.get('/exchange/currencies',getCurrencyList);

app.post('/exchange/convert',convertCurrency);