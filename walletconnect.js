// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, orderBy, limit, getDocs, query, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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
const db = getFirestore(app);

export async function isConnected() {
  const accounts = await ethereum.request({method: 'eth_accounts'});       
  if (accounts.length) {
    console.log(`You're connected to: ${accounts[0]}`);
    return true;
  } else {
    console.log("Metamask is not connected");
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
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const account = accounts[0];
}

document.getElementById("ConnectMet").addEventListener("click", connectionMet);
//document.querySelector('[data-score-screen]').addEventListener("click", getScore);

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