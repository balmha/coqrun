// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, orderBy, limit, getDocs, query, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ethers, isError } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import abi from './coqABI.json' assert { type: "json" };
const contractABI = abi.abi;
const coqAddress = "0x420FcA0121DC28039145009570975747295f2329";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoM4pfz-xutn4cXeEGXGMrDnn6-EFL7ss",
  authDomain: "coqrunner.firebaseapp.com",
  projectId: "coqrunner",
  storageBucket: "coqrunner.appspot.com",
  messagingSenderId: "270887442026",
  appId: "1:270887442026:web:1bbcf05d1dccc9c8259c13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Anonymous authentication
const auth = getAuth();
signInAnonymously(auth)
  .then(() => {
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Sign-in failed:", errorMessage);
  });

const db = getFirestore(app);

// AVALANCHE Connection
// Avalanche Network information for automatic onboarding in MetaMask
const AVALANCHE_MAINNET_PARAMS = {
  chainId: '0xA86A',
  chainName: 'Avalanche Network C-Chain',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18
  },
  rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://snowtrace.io/']
};

let globalChainId;

export function IsAvalancheSelected(){
  if (localStorage.globalChainId == "0xa86a"){
    return true;
  }
  else {
    return false;
  }
}

export async function isConnected() {
  const accounts = await ethereum.request({method: 'eth_accounts'});       
  if (accounts.length && IsAvalancheSelected()) {
    console.log(`You're connected to: ${accounts[0]}`);
    return true;
    }
  else {
    console.log("Metamask or Avalanche are not connected", localStorage.globalChainId);
    return false;
  }
}

async function connectionMet(){
  if (typeof ethereum === 'undefined') {
    console.log('Metamask not connected.');
    return;
  }
  // ... continue with initializing Web3
  web3 = new Web3(window.ethereum); // initialize Web3
  ethereum.request({ method: "eth_requestAccounts" });
  ethereum.request({"method": "wallet_switchEthereumChain","params": [{"chainId": "0xA86A"}]})
    .then(function(result) {localStorage.globalChainId = "0xa86a";})
    .catch(function(error) {
      window.ethereum.request({method: 'wallet_addEthereumChain', params: [AVALANCHE_MAINNET_PARAMS]})
    });
}

document.getElementById("ConnectMet").addEventListener("click", connectionMet);
document.getElementById("myPopup").addEventListener("click", hiddenSpan);
document.getElementById("RejectPopup").addEventListener("click", hiddenRejected);
document.getElementById("sendcoqs").addEventListener("submit", sendCoq);

// Here I will work over the popup modal
$('#sendModal').on('hidden.bs.modal', function (e) {
  $(this)
    .find("input,textarea,select")
       .val('')
       .end()
    .find("input[type=checkbox], input[type=radio]")
       .prop("checked", "")
       .end();
})
//

window.ethereum.on('connect', (connectInfo) => {
  if (window.ethereum.isConnected() === true){
    localStorage.globalChainId = connectInfo.chainId.toLowerCase();
  }
  else {
    windows,alert("Metamask is not installed. Please install Metamask.");
  }
})
//document.querySelector('[data-score-screen]').addEventListener("click", getScore);

window.ethereum.on('chainChanged', (chainId) =>{
  localStorage.globalChainId = chainId.toLowerCase();
  console.log(localStorage.globalChainId)
  window.location.reload();
});

window.ethereum.on('accountsChanged', function(accounts) {
  window.location.reload()  
});

export async function getScore(score) {
  const accounts = await ethereum.request({method: 'eth_accounts'});
  //Add entry
  //Add a new document with a generated id.
  const docRef = await addDoc(collection(db, "score"), {
    address: accounts[0],
    score: parseInt(score)
  });
  const q = query(collection(db, "score"), orderBy("score","desc"), limit(5));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.data().address, " => ", doc.data().score);
    filltable(doc.data().address, doc.data().score);
  });
}

function filltable(address, score) {
  const table = document.getElementById('scoreboard');
  const row = table.insertRow();
  const cell1 = row.insertCell();
  const cell2 = row.insertCell();
  cell1.innerHTML = address;
  cell2.innerHTML = score;  
}

export function cleantable() {
  var myTable = document.getElementById("scoreboard");
  var rowCount = myTable.rows.length;
  for (var x=rowCount-1; x>0; x--) {
    myTable.deleteRow(x);
  }

}

export async function sendCoq(event){
  event.preventDefault();
  var address=document.getElementById('recipient-name').value;
  var amount=document.getElementById('amount').value;
  const parsedAmount = ethers.parseUnits(amount, "ether");

  const tempProvider = await new ethers.BrowserProvider(window.ethereum)
  const tempSigner = await tempProvider.getSigner();
  const tempContract = new ethers.Contract(coqAddress, contractABI, tempSigner);

  try {
    const tx = await tempContract.transfer(
      address, // to
      parsedAmount // balance
    ).then(()=>{$('#sendModal').modal('hide')});
    //0xF839869e92f536bc00224996f1958EfF127A4d22
  } catch (error) {
    if (isError(error, "ACTION_REJECTED")) {
      // The Type Guard has validated this object
      hiddenRejected();
      console.log(error.data);
    }
    else {
      hiddenSpan();
      console.log(error.data);
    }
  }
}

function hiddenSpan(){
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}

function hiddenRejected(){
  var popup = document.getElementById("RejectPopup");
  popup.classList.toggle("show");
}