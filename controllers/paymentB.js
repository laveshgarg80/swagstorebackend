const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "qnh79dh4vfq353nw",
  publicKey: "6b4rvsp3fxnzdyv9",
  privateKey: "efacea1f580434d5c19645389500fee2"
});


exports.getToken = (req,res) => {
    gateway.clientToken.generate({
     
      }, (err, response) => {
          if(err){
              res.status(500).send(err)
          }
          else{
              res.send(response)
          }
      });
    // gateway.clientToken.generate({
    //     customerId: aCustomerId
    //   }).then(response => {
    //     // pass clientToken to your front-end
    //     const clientToken = response.clientToken
    //   });
    
}

exports.processPayment = (req,res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce

    let amountFromTheClient = req.body.amount
    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
          if(err){
              res.status(500).json(error)
          }
          else{
              res.json(result);
          }
      });
}