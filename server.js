var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', //sandbox or live 
  'client_id': 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
  'client_secret': 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM'
});

var app = express();

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({'extended': true})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(session({ secret: 'yourTaskSecret',resave: true,
    saveUninitialized: true}));


//payment code

var payment = {
  "intent": "sale",
  "payer": {
    "payment_method": "credit_card",
    "funding_instruments": [{
      "credit_card": {
        "number": "5500005555555559",
        "type": "mastercard",
        "expire_month": 12,
        "expire_year": 2018,
        "cvv2": 111,
        "first_name": "Joe",
        "last_name": "Shopper"
      }
    }]
  },
  "transactions": [{
    "amount": {
      "total": "5.00",
      "currency": "USD"
    },
    "description": "test payment"
  }]
}

app.get('/payment',function(req,res){
	paypal.payment.create(payment, function (error, payment) {
	  if (error) {
	    console.log(error);
	  } else {
	    console.log(payment)
	  }
	});
})

app.listen(4000, function(){
  console.log('Express server listening on port 4000');
});