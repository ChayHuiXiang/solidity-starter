const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const {interface, bytecode} = require('../compile');

let lottery;
let accounts;

beforeEach(async()=>{
    accounts = await web3.eth.getAccounts(); 

    lottery = await new web3.eth.Contract(JSON.parse(interface)) // deploys the contract
        .deploy({data: bytecode})
        .send({from:accounts[0],gas:'1000000'});
});

describe('Lottery Contract',()=>{
    it('deploys a contract',()=>{ // test to ensure contract is deployed
        assert.ok(lottery.options.address);
    });
    it('allows one account to enter', async ()=>{ // test to ensure enter function is working
        await lottery.methods.enter().send({ // calls the enter function
            from: accounts[0],
            gas:'1000000',
            value: web3.utils.toWei('0.02','ether'), // convert 0.02 ether to wei using web3 utils
        });

        const players = await lottery.methods.getPlayers().call({ // calls the getplayers function
            from: accounts[0],
        })

        assert.equal(1,players.length); // ensures that one player has entered
        assert.equal(players[0],accounts[0]); // ensures that the entered player's address matches
    });
    it('allows multiple accounts to enter', async()=>{ // test to ensure that multiple accounts can enter lottery
        for (let i = 0; i<3; i++){ // for loop to enter 3 players into the lottery
            await lottery.methods.enter().send({
                from:accounts[i],
                gas:'1000000',
                value: web3.utils.toWei('0.02','ether'),
            });
        }
        const players = await lottery.methods.getPlayers().call({ // get the players array after all have entered
            from: accounts[0],
        });
        assert.equal(3,players.length); // ensures that there are 3 players
        for (let i = 0;i<3;i++){
            assert.equal(players[i],accounts[i]); // ensures that all 3 addresses match
        }
    });
    it('requires a minimum amount of ether', async()=>{ // test to ensure that at least 0.01 ether is required to enter
        try {
            await lottery.methods.enter().send({
                from: account[0],
                value: 200,
                gas: '1000000',
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('only manager can call pickWinner',async()=>{ // test to ensure that non-managers cannot pick the winner
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });
});