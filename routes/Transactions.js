const express = require("express");
const router = express.Router();
const algosdk = require("algosdk");

const algod_server = "https://testnet-algorand.api.purestake.io/ps2";
const algod_port = "";
const algod_token = {
  "X-API-Key": "8LtYbv0XMB6wBXhJ2dJPR6LUDDXyEZTUrrT97Daa",
};

router.post("/", async (req, res) => {
  try {
    const { price, mnemonic } = req.body;

    if (!price || !mnemonic) {
      return res.status(400).json({
        msg: "Missing Parameters",
      });
    }

    let algodClient = new algosdk.Algodv2(
      algod_token,
      algod_server,
      algod_port
    );

    var recoveredAccount = algosdk.mnemonicToSecretKey(mnemonic);
    console.log("the owner of the mnemonic ", recoveredAccount.addr);

    // (async() => {

    // check my account balance

    let accountInfo = await algodClient
      .accountInformation(recoveredAccount.addr)
      .do();
    console.log("Account balance: %d microAlgos", accountInfo.amount);

    let productCost = price * 1000000;

    if (accountInfo.amount < productCost) {
      return res.status(401).json({ msg: "Balance is too low" });
    }

    // Create the transaction

    let params = await algodClient.getTransactionParams().do();

    const receiver =
      "GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A";
    let note = algosdk.encodeObj("Payment for Clothes");

    let txn = algosdk.makePaymentTxnWithSuggestedParams(
      recoveredAccount.addr,
      receiver,

      //1 Algo equals 1,000,000 microAlgos.
      productCost,
      undefined,
      note,
      params
    );

    console.log({ txn });

    // Sign the transaction
    let signedTxn = txn.signTxn(recoveredAccount.sk);

    console.log({ signedTxn });
    let txId = txn.txID().toString();
    console.log("Signed transaction with txID: %s", txId);

    // Submit the transaction
    var success = await algodClient.sendRawTransaction(signedTxn).do();
    if (success) {
      return res.json({
        success: true,
      });
    } else {
      return res.json({
        success: false,
      });
    }
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      msg: "Internal Error",
    });
  }
});


router.post("/account-balance", async (req, res) => {
  try {
    const { mnemonic } = req.body;

    if ( !mnemonic) {
      return res.status(400).json({
        msg: "Missing Parameters",
      });
    }

    let algodClient = new algosdk.Algodv2(
      algod_token,
      algod_server,
      algod_port
    );

    var recoveredAccount = algosdk.mnemonicToSecretKey(mnemonic);

    let accountInfo = await algodClient
      .accountInformation(recoveredAccount.addr)
      .do();
      // return the users balance
    res.json(accountInfo.amount)
  
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      msg: "Internal Error",
    });
  }
});


module.exports = router;
