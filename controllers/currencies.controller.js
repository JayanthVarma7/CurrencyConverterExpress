
const fetch = require("node-fetch");
const Joi = require('joi'); 

const getCurrencyList = async (req,res)=>{
    await fetch('https://open.er-api.com/v6/latest')
    .then((response)=>response.json())
    .then((data) => {
        const cl=Object.keys(data.rates);
        res.status(200).json({"data":cl});
    })
    .catch((err) => {
        res.status(500)
        .json({'message' : 'The service is currently down, please check again later'});
    });
    
};

const convertCurrency = async (req,res)=>{
    const {value,currency,to_currency}=req.body;
    const schema = Joi.object().keys({
        value: Joi.number().min(0).required(),
        currency: Joi.string().min(3).max(3).required(),
        to_currency: Joi.string().min(3).max(3).required(), 
    });

    const result=schema.validate({value,currency,to_currency})
    if(result.error){
        res.status(400).send('{message: "Incomplete or Incorrect data passed"}')
    }else{
        await fetch(`https://open.er-api.com/v6/latest/${currency}`)
        .then((response)=>response.json())
        .then((data) => {
            if(data.result==="success" && data.rates[to_currency]){
                const convertingParam=data.rates[to_currency] * value;
                res.status(200).json({"result":convertingParam}).end();
            }else{
                res.status(404).json({"message": "Cannot find given currency code"})
            }
        })
        .catch((err) => {
            res.status(500)
            .json({'message' : 'The service is currently down, please check again later'});
        });
    }
};

module.exports = { getCurrencyList, convertCurrency };