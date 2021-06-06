const express = require("express");

const router = express.Router();
const algosdk = require("algosdk");


router.get("/create", (req, res) => {

    var keys = algosdk.generateAccount();
  
    var mnemonic = algosdk.secretKeyToMnemonic(keys.sk);
  
    var isValid = algosdk.isValidAddress(keys.addr);
  
    (async () => {
      console.log(keys.addr);
      console.log(mnemonic);
  
      console.log("is valid ? ", isValid);
  
      if (isValid) {
        // saving the user functionality here
  
        return res.json({
          addr: keys.addr,
  
          mnemonic: mnemonic,
          isValid: isValid,
          sk: keys.sk,
        });
      } else {
        return res.json("Address is not valid");
      }
  
      // Will save the users address without the mnemonic
      // that should be all about auth
    })().catch((e) => {
      console.log(e);
    });
  });


  router.post("/recover", (req, res) => {
    const { mnemonic } = req.body;
  
    if (!mnemonic) {
      return res.status(400).json({
        msg: "Please enter your mnemonic",
      });
    }
    // Recover the users address from mnemonic
  
    var address = algosdk.mnemonicToSecretKey(mnemonic);
  
    (async () => {
      console.log(address);
  
      // saving the user functionality here
  
      return res.json({
        address: address.addr,
        mnemonic: mnemonic,
      });
  
      // Will save the users address without the mnemonic
      // that should be all about auth
    })().catch((e) => {
      console.log(e);
      return res.status(500).json("Internal error");
    });
  });

  
module.exports = router;
