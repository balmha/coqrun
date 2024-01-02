var Web3 = require('web3');
var provider = 'https://avalanche-mainnet.infura.io';
var web3Provider = new Web3.providers.HttpProvider(provider);
var web3 = new Web3(web3Provider);
/* web3.eth.getBlockNumber().then((result) => {
  console.log("Latest Ethereum Block is ",result);
}); */

/* To connect using MetaMask */
async function connect() {
    if (web3.eth) {
        web3.eth.requestAccounts().then(console.log);
    } else {
     console.log("No wallet");
    }
}