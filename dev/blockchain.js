const sha256= require('sha256');
const express = require('express');
const currentnodeurl = "http://localhost:"+process.argv[2];
const uuid = require('uuidv1');
const crypto =require('crypto');
function Blockchain(){
 this.chain= [];
 this.rules=[];
 this.pendingTransactions=[];
 this.currentnodeurl=currentnodeurl;
 this.CurrentNodePublickey =[];
 this.networknodes=[];

 this.createNewBlock(0, '0', '0'/*this.calculateHash('0',[],100)*/);

 // partage de alorithm de cryptage utilisé

 const cryptoalo = crypto.createECDH('secp256k1');
 
this.initialrules('secp256k1');

//this.initiate_crypto_alorithm(''+this.rules[0].Alorithm);

	/*const Puk = cryptoalo.getPublicKey().toString('base64');
    const publickey = {Publickey_1 : Puk};
	this.CurrentNodePublickey.push(publickey);*/
	 const keys = crypto.createECDH('secp256k1');
     keys.generateKeys();
   const currentnodePuk = {Puk: keys.getPublicKey().toString('base64')};

   this.CurrentNodePublickey.push(currentnodePuk);


}



/*
Blockchain.prototype.initiate_crypto_alorithm = function(algo)
{
	const currentnodeECDHalgo = crypto.createECDH(algo);
	const Puk = currentnodeECDHalgo.getPublicKey().toString('base64');
    const publickey = {Publickey_1 : Puk};
	this.CurrentNodePublickey.push(publickey);

	return publickey;
}
*/
Blockchain.prototype.createNewBlock= function(nonce, previousBlockHash, hash){

const newBlock={
	index: this.chain.length+1, 
	timestamp: Date.now(), 
 transactions: this.pendingTransactions,
 nonce: nonce, previousBlockHash: previousBlockHash, hash : hash};
this.pendingTransactions=[];
this.chain.push(newBlock);
return newBlock;
}

// initialise network rules

Blockchain.prototype.initialrules= function(cryptoalgorithm)
{
	const Algorithm_cryptoraphic ={Alorithm : cryptoalgorithm};

	this.rules.push(Algorithm_cryptoraphic);

	return Algorithm_cryptoraphic;

}

Blockchain.prototype.getLatestBlock =function(){

	return this.chain[this.chain.length-1];
}

/*Blockchain.prototype.createNewTransaction = function(data, sender, recepient){

	const newTransaction= {data: data, sender: sender, recepient: recepient};

	this.pendingTransactions.push(newTransaction);
""
	return this.getLatestBlock()['index'] + 1;
}*/
Blockchain.prototype.createNewTransaction=function(data, sender, recepient){

	const newTransaction={data: data, sender:sender, recepient:recepient, transactionid:  uuid().split('-').join('')};

	return newTransaction;
};

Blockchain.prototype.addnewtransactiontopendingtransactions = function(tranobj) {
	this.pendingTransactions.push(tranobj);

	return this.getLatestBlock()['index'] + 1;

};

Blockchain.prototype.calculateHash=function(previousBlockHash, blockdata, nonce)
{
	const passstring= previousBlockHash+nonce.toString()+JSON.stringify(blockdata);

	const hash=sha256(passstring);
	return hash;
}

Blockchain.prototype.proofofwork= function(previousBlockHash,blockdata)
{
	let nonce=0;
    let hash = this.calculateHash(previousBlockHash, blockdata,nonce);

    while(hash[0]!=="0")
    {
    	nonce++;

    	hash =this.calculateHash(previousBlockHash, blockdata, nonce);
    	 console.log(hash);
    	 console.log(nonce);

    };


    return nonce;

};

Blockchain.prototype.isvalidblock=function(block){

const vb =true;
const indexblock= block['index'];
const previousblockhash=block['previousBlockHash'];
const previousblockfined=this.getBlock(previousblockhash);

if((previousblockfined===null) || (previousblockfined!==null  && previousblockfined['index']+1 !==indexblock)) vb ==false;



};

Blockchain.prototype.isvalidchain= function(blockchain){

	let vc=true;
for (var i = 1 ; i < blockchain.length; i++) {
		const currentBlock = blockchain[i];
		const prevBlock = blockchain[i - 1];
		const blockHash = this.calculateHash(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);
		if (blockHash.substring(0) !== '0') vc = false;
		if (currentBlock['previousBlockHash'] !== prevBlock['hash']) vc = false;
	};


	// we can also verify the validity of genesis block right here

return vc;

};

// looking for transaction, block and address 

Blockchain.prototype.getBlock = function(blockHash) {
	let correctBlock = null;
	this.chain.forEach(block => {
		if (block.hash == blockHash) correctBlock = block;
	});
	return correctBlock;
};


Blockchain.prototype.getTransaction = function(transactionid) {
	let correctTransaction = null;
	let correctBlock = null;

	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.transactionid === transactionid) {
				correctTransaction = transaction;
				correctBlock = block;
			};
		});
	});

	return {
		transaction: correctTransaction,
		block: correctBlock
	};
};


Blockchain.prototype.getAddressData = function(address) {
	const addressTransactions = [];
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if(transaction.sender === address || transaction.recipient === address) {
				addressTransactions.push(transaction);
			};
		});
	});

	return {
		addressTransactions: addressTransactions,
	};
};



Blockchain.p
module.exports=Blockchain;

/*Blockchain.prototype.getblock=function(blockhash){

	let correctblock =null;

	this.chain.forEach(blk => {

		if(blk.hash===blockhash) correctblock=blk;
	});
	return  correctblock;
}
*/