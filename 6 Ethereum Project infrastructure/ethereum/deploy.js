const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');
const compiledCampaign = require('./build/Campaign.json');

const provider = new HDWalletProvider(
  'buzz chuckle matter shield butter school ghost cage moral same wasp grant',
  // remember to change this to your own phrase!
  'https://goerli.infura.io/v3/27329cef779644bbb38f91c985e66b9e'
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1000000', from: accounts[0] });
    
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
