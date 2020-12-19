const express = require('express');
const app = express();
const crypto =require('crpto');
const bodyparse= require("body-parser");
const Blockchain = require('./blockchain');
const uuid = require('uuidv1');
const port = process.argv[2];
const rp=require("request-promise");
// const nodeaddress ="AERTYUIFJK979233"; 
const nodeaddress= uuid().split('-').join('');

b= new Blockchain();

app.use(bodyparse.json());
app.use(bodyparse.urlencoded({extended: false}));


app.get('/blockchain', function(req,res){
	res.send(b);

});

// tansaction befor synch

/* app.post('/transaction', function(req,res)
	{ 
		const indexblock = b.createNewTransaction(req.body.data, req.body.sender, req.body.recipient);
		res.send(`the transaction will be added to the block  ${indexblock}$`);

	res.send("transaction added");
});
 */

// The second step of add transaction to pendin transactions
app.post('/transaction', function(req,res)
	{ 
		const newtransaction= req.body;
		const blockindex= b.addnewtransactiontopendingtransactions(newtransaction);
		res.json({note: `the transaction will be added to the block  ${blockindex}$`});

	res.send("transaction added");
});

// the first step of add transaction to pendin transactions
app.post('/transaction/broadcast',function(req,res){

const newtransaction= b.createNewTransaction(req.body.data, req.body.sender, req.body.recipient);
b.addnewtransactiontopendingtransactions(newtransaction);

const requestpromises= [];

b.networknodes.forEach(nodeeleemnt => {

	const requestoptions= { 
		uri: nodeeleemnt + '/transaction', 
		method: 'POST', 
		body : newtransaction, 
		json: true};

	requestpromises.push(rp(requestoptions));
});

Promise.all(requestpromises)
.then( data => res.json({note: 'transaction added and broadcasted successfully '}));

});

app.post('/receivenewblock',function(req,res){
	const newblock=req.body.newblock;
	const latestblock=b.getLatestBlock();
	const correcthash= (latestblock.hash=== newblock.previousBlockHash);
	const correctindex = latestblock['index'] +1 === newblock['index'];

	if(correctindex && correcthash){
		b.chain.push(newblock);
        b.pendingTransactions=[];
        res.json({
        	note: 'newblock received and accepted',
        	newblock:newblock
        });
	}
	else
		{
        res.json({
        	note: 'newblock rejected',
        	newblock:newblock
        });}
});

app.get('/mine',function(req,res){

	const latestblock = b.getLatestBlock();
	const previousBlockHash=latestblock['hash'];
	const blockdata = {transactions : b.pendingTransactions,index:latestblock['index']};

    const  nonce= b.proofofwork(previousBlockHash, blockdata);
   const hash = b.calculateHash(previousBlockHash,blockdata,nonce);
   const rewardtransaction =b.createNewTransaction(12.5, "00", nodeaddress);
   b.pendingTransactions.push(rewardtransaction);
	const newblock= b.createNewBlock(nonce, previousBlockHash,hash);
	//newblock.transactions.push(rewardtransaction);

/*	b.pendingTransactions.foEach(elt => {

		newblock.push(elt);
	});*/

	const requestpromises =[];

	b.networknodes.forEach(elt =>{

const requestoptions={
	uri:elt+'/receivenewblock',
	method:'POST',
	body:{newblock: newblock},
	json: true
};
requestpromises.push(rp(requestoptions));
});

	Promise.all(requestpromises)
	.then(data => res.json ({note: "new block created successfully", block:newblock}));

  const info =[{note: "block succ created", block: newblock}];

 res.send(info);
});

//Reistration Node Procesure


app.post('/register-and-broadcast-node',function(req,res){
	const newnodeurl= req.body.newnodeurl;
	if(b.networknodes.indexOf(newnodeurl)==-1) b.networknodes.push(newnodeurl);

	const nodespromises=[];

	b.networknodes.forEach(networknodeurl => {
		const requestoptions={
			uri: networknodeurl+'/register-node', 
			method:'POST',
			body:{newnodeurl:newnodeurl},
			json:true};
		nodespromises.push(rp(requestoptions));

	});
	Promise.all(nodespromises)
	.then(data =>{
		const bulkregisteroptions={
			uri:newnodeurl+'/register-nodes-bulk',
			method: 'POST',
			body:{allnetworknodes:[...b.networknodes, b.currentnodeurl]},
			json:true
		};

		return rp(bulkregisteroptions);
	})
	.then(data => {res.json({ note: 'new node successfully registreted in the network'})});
});

app.post('/register-node', function(req,res){
	const newnodeurl=req.body.newnodeurl;
	const nodenotalreadyexist = (b.networknodes.indexOf(newnodeurl)==-1);
	const notcurrentnode = (b.currentnodeurl !== newnodeurl);

	if(notcurrentnode && nodenotalreadyexist) b.networknodes.push(newnodeurl);
	res.json({note: 'node successfully registered'})});

app.post('/register-nodes-bulk',function(req,res){
	const allnetworknodes=req.body.allnetworknodes;

	allnetworknodes.forEach(networknodeurl => {
		const nodenotalreadyexist= (b.networknodes.indexOf(networknodeurl)==-1);
		const notcurrentnode = (b.currentnodeurl !== networknodeurl);
	if(nodenotalreadyexist && notcurrentnode) b.networknodes.push(networknodeurl);
   });
	res.json({note: 'resgistretion successfull in Bulk'});
});
/*for(var i=0; i<allnetworknodes.lenght-1;i++){
	const nodenotalreadyexist= (b.networknodes.indexOf(allnetworknodes[i])==-1);
		const notcurrentnode = (b.currentnodeurl !== allnetworknodes[i]);
	if(nodenotalreadyexist && notcurrentnode) b.networknodes.push(allnetworknodes[i]);
};
res.json({note: 'resgistretion successfull in Bulk'}); });*/

//synchronization of blockchain between nodes

/*
app.get('/consnesus', function(req,res){

	const requestpromises=[];
	b.networknodes.forEach(elt => {

		const requestoptions ={
			uri: elt + '/blockchain',
			method:'GET',
			json:true
		};

		requestpromises.push(rp(requestoptions));
	});


	Promise.all(requestpromises)
	.then(blockchains => {

		const currentchainleght= b.chain.lenght;
		let maxchainlenght= currentchainleght;
		let newlongestchain =null;
		let newpendingtransactions=null;

		blockchains.forEach(blockchian =>{

			if (blockchain.chian.lenght>maxchainlenght)
			{
				maxchainlenght=blockchain.chain.lenght;
				newlongestchain=blockchain.chain;
				newpendingtransactions=blockchain.pendingTransactions;
			};
		});

		if (!newlongestchain || (newlongestchain &&  !b.isvalidchain(newlongestchain))){

			res.json({note: 'current chain not replaced'});
		}
		else{
			b.chain=newlongestchain;
			b.pendingTransactions=newpendingtransactions;
			
			res.json({ note: 'chain is replaced'})
		};

	});
});*/

app.get('/consensus', function(req, res) {
	const requestPromises = [];
	b.networknodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/blockchain',
			method: 'GET',
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(blockchains => {
		const currentChainLength = b.chain.length;
		let maxChainLength = currentChainLength;
		let newLongestChain = null;
		let newPendingTransactions = null;
		console.log(currentChainLength);

		blockchains.forEach(blockchain => {
			if (blockchain.chain.length > maxChainLength) {
				maxChainLength = blockchain.chain.length;
				newLongestChain = blockchain.chain;
				newPendingTransactions = blockchain.pendingTransactions;
               

			};
		});

		console.log(maxChainLength);
		console.log(newLongestChain);
		const vc= b.isvalidchain(newLongestChain);
		console.log(vc);

		if (!newLongestChain) {
			res.json({
				note: 'Current chain has not been replaced.',
				chain: b.chain
			});
		}
		else {
			b.chain = newLongestChain;
			b.pendingTransactions = newPendingTransactions;
			res.json({
				note: 'This chain has been replaced.',
				chain: b.chain
			});
		};
	});
});


app.get('/block/:blockHash', function(req, res) { 
	const blockHash = req.params.blockHash;
	const correctBlock = b.getBlock(blockHash);
	res.json({
		block: correctBlock
	});
});


app.get('/transaction/:transactionId', function(req, res) {
	const transactionId = req.params.transactionId;
	const trasactionData = b.getTransaction(transactionId);
	res.json({
		transaction: trasactionData.transaction,
		block: trasactionData.block
	});
});



app.get('/address/:address', function(req, res) {
	const address = req.params.address;
	const addressData = b.getAddressData(address);
	res.json({
		addressData: addressData
	});
});

app.get('/explorer',function(req,res){
	res.sendFile('./index.html', {root:__dirname});
});


app.listen(port, function(){console.log(`listining on port ${port}$`)})
