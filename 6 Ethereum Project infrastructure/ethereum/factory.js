import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x1cfc35cF40242B157901C6036B29aA1B5f8A01C1'
);

export default instance;