const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async()=>{
    accounts = await web3.eth.getAccounts();
    
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)) // deploy campaign factory
        .deploy({data:compiledFactory.bytecode})
        .send({from:accounts[0],gas:'1000000'});
    
    await factory.methods.createCampaign('100').send({ // creates campaign with minimumContribution of 100 wei
        from: accounts[0],
        gas:'1000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); // get the address of the deployed campaign
    campaign = await new web3.eth.Contract( // creates a new campaign object
        JSON.parse(compiledCampaign.interface),
        campaignAddress,
    );
});

describe('Campaigns',() => {
    it('deploys a factory and a campaign',()=>{ // ensures that factory and campaign has been deployed
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager',async()=>{ // ensures that campaign manager has the same address as first account
        const manager = await campaign.methods.manager().call();
        assert.equal(manager,accounts[0]);
    });

    it('allows people to contribute money and mark them as approvers',async()=>{ // ensures that approvers and contributers system works
        await campaign.methods.contribute().send({
            value:'200',
            from: accounts[1]
        });
        assert(await campaign.methods.approvers(accounts[1]).call()); // accesses the approvers mapping in the contract
    });
    it('requires a minimum contribution',async()=>{ // ensures that theres a minimum contribution value of 100 wei
        try {
            await campaign.methods.contribute().send({
                value:'99',
                from:accounts[1]
            });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });
    it('allows the manager to make a payment request',async()=>{ // ensures that manager can create request
        await campaign.methods.createRequest(
            'Buy batteries',
            '100',
            accounts[2],
        ).send({
            from: accounts[0],
            gas: '1000000',
        });

        const request = await campaign.methods.requests(0).call();
        assert.equal(request.description,'Buy batteries');
    });
    it('processes requests',async()=>{ // full end-to-end test
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('10','ether')
        });
        await campaign.methods.createRequest(
            'A',
            web3.utils.toWei('5','ether'),
            accounts[2],
        ).send({
            from: accounts[0],
            gas: '1000000',
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '1000000',
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000',
        });
        const request = await campaign.methods.requests(0).call();
        assert(request.complete);

        let balance = await web3.eth.getBalance(accounts[2]);
        balance = web3.utils.fromWei(balance,'ether');
        balance = parseFloat(balance);

        assert(balance > 101);
    });
});