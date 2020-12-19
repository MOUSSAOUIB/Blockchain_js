const Blockchain = require('./blockchain');

const uuid = require('uuidv1');
const nodeaddress= uuid().split('-').join('');
const sha256= require('sha256');


/* b.createNewBlock(123, "AB025655FENCDC", "FHDCJJD5555D99D");

b.createNewTransaction(50,'alice','bob');

b.createNewBlock(124, "AHFODPP895666","BNDDSKLSMS5586");*/ 

/*
+const previousHash="81665ADFB8956622";

const nonce=1665741;

const blockdata=[
{amount : 10, sender: "8565841548566", recipient: "85455454AFF"},
{amount : 20, sender: "865689A985BBC", recipient: "656895656FF"},
]

console.log(b.proofofwork(previousHash, blockdata));*/
/*

const bc ={
  "chain": [
    {
      "index": 1,
      "timestamp": 1593041073994,
      "transactions": [
        
      ],
      "nonce": 100,
      "previousBlockHash": "0",
      "hash": "feb7e14997d3c793b0b7805723fffb35690e4f91decb63b4437f2bbee68b98f3"
    },
    {
      "index": 2,
      "timestamp": 1593041134429,
      "transactions": [
        {
          "amount": 12.5,
          "sender": "00",
          "recepient": "3e8c9f50b67a11ea8a1ae5583ebc1a1b",
          "transactionid": "629308d0b67a11ea80b88a67d497ac91"
        }
      ],
      "nonce": 0,
      "previousBlockHash": "feb7e14997d3c793b0b7805723fffb35690e4f91decb63b4437f2bbee68b98f3",
      "hash": "0af32cd79439dbc11da69b665072584cbab108f0d252ec9199f95730ce757475"
    },
    {
      "index": 3,
      "timestamp": 1593041134967,
      "transactions": [
        {
          "amount": 12.5,
          "sender": "00",
          "recepient": "3e8c9f50b67a11ea8a1ae5583ebc1a1b",
          "transactionid": "62e52070b67a11ea85641e58bce7807b"
        }
      ],
      "nonce": 51,
      "previousBlockHash": "0af32cd79439dbc11da69b665072584cbab108f0d252ec9199f95730ce757475",
      "hash": "0a6503ae7f30ed6f20197368e54c2ff0c2094d9792d87815c2f43c6d78cae849"
    },
    {
      "index": 4,
      "timestamp": 1593041135182,
      "transactions": [
        {
          "amount": 12.5,
          "sender": "00",
          "recepient": "3e8c9f50b67a11ea8a1ae5583ebc1a1b",
          "transactionid": "6305eee0b67a11ea8e73a75f2c89a4eb"
        }
      ],
      "nonce": 13,
      "previousBlockHash": "0a6503ae7f30ed6f20197368e54c2ff0c2094d9792d87815c2f43c6d78cae849",
      "hash": "07a2ed067d8b61b0fda0d92d783d53c206974b9fd03680c3f16b75abc35a32fe"
    },
    {
      "index": 5,
      "timestamp": 1593041135352,
      "transactions": [
        {
          "amount": 12.5,
          "sender": "00",
          "recepient": "3e8c9f50b67a11ea8a1ae5583ebc1a1b",
          "transactionid": "631fdf80b67a11ea8d6b1ce8b1c37419"
        }
      ],
      "nonce": 2,
      "previousBlockHash": "07a2ed067d8b61b0fda0d92d783d53c206974b9fd03680c3f16b75abc35a32fe",
      "hash": "04a0241d2744389bd2a074f952f59762a4910b30230679040c8acf3fd5981714"
    },
    {
      "index": 6,
      "timestamp": 1593041135856,
      "transactions": [
        {
          "amount": 12.5,
          "sender": "00",
          "recepient": "3e8c9f50b67a11ea8a1ae5583ebc1a1b",
          "transactionid": "636c9ff0b67a11ea80279177afec67ad"
        }
      ],
      "nonce": 27,
      "previousBlockHash": "04a0241d2744389bd2a074f952f59762a4910b30230679040c8acf3fd5981714",
      "hash": "060cf6e81357294232f2094b81338d40c8b6657bf63207c9d95efd5b849274bc"
    }
  ],
  "pendingTransactions": [
    
  ],
  "currentnodeurl": "http://localhost:3001",
  "networknodes": [
    
  ]
} */

/*
const hash=sha256("mousaoui");
const hashbinary= hexToBinary(hash);

hexToBinary(s)={
    const  r= null;
    const lookupTable = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
        '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
        'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
        'e': '1110', 'f': '1111'
    };
    for (let i= 0; i < s.length; i = i + 1) {
        if (lookupTable[s[i]]) {
            r += lookupTable[s[i]];
        } else {
            return null;
        }
    };
    return ret;
};

console.log('hash:',hash);
console.log('hashbinary:',hashbinary)*/

const rule=[];
const p= {alo: "26"};

rule.push(p);
console.log(`rule[0].alo`);
