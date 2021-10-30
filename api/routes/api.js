const express = require('express');
const router = express.Router();
// const Provider = require('@truffle/hdwallet-provider');
require('dotenv').config();
const { fetchVoter } = require('../middlewares/auth');

// const privateKey = process.env.PRIVATEKEY;
// const url = process.env.BLOCKCHAINURL;
// const address = process.env.ADDRESS;
const client = require('twilio')(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

router.get('/', (req, res, next) => res.json({ msg: 'Application Running' }));

router.get('/test/', async (req, res, next) => {
  // try {
  //   const provider = new Provider(privateKey, url);
  //   const web3 = new Web3(provider);
  //   const networkId = await web3.eth.net.getId();
  //   const myContract = new web3.eth.Contract(
  //     MyContract.abi,
  //     MyContract.networks[networkId].address
  //   );

  //   console.log(await myContract.methods.get().call());
  //   console.log(`Old data value: ${await myContract.methods.get().call()}`);
  //   const receipt = await myContract.methods.set(3).send({ from: address });
  //   console.log(`Transaction hash: ${receipt.transactionHash}`);
  //   console.log(`New data value: ${await myContract.methods.get().call()}`);
  // } catch (err) {
  //   console.log(err);
  // }
  res.send('Hi');
});

// Register Voter in Blockchain
// Send OTP to Voter
router.get('/regVoter/sendOTP', fetchVoter, async (req, res, next) => {
  console.log(req.phone);
  console.log(req.pinCode);
  console.log(req.hasRegistered);
  if (req.hasRegistered === true) {
    return res.status(400).json({
      msg: 'Voter already registered',
    });
  }

  //   console.log(req.phone);
  //   console.log(req.pinCode);
  //   console.log(req.hasRegistered);

  if (req.phone) {
    client.verify
      .services(process.env.SERVICE_ID)
      .verifications.create({
        to: `+${req.phone}`,
        channel: 'sms',
      })
      .then(data => {
        res.status(200).send({
          message: 'OTP is sent!',
          phonenumber: req.phone,
          data,
        });
      });
  } else {
    res.status(400).send({
      message: 'Wrong phone number :(',
      phonenumber: req.phone,
      data,
    });
  }
});

module.exports = router;
