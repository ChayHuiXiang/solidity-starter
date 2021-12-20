const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname,"build");
fs.removeSync(buildPath); // removes the build folder

const campaignPath = path.resolve(__dirname,"contracts","Campaign.sol");
const source = fs.readFileSync(campaignPath,"utf-8"); // read the source code from Campaign.sol
const output = solc.compile(source,1).contracts; // compile source code

fs.ensureDirSync(buildPath); // create build folder

for (let contract in output) { // output a new JSON file for every contract inside Campaign.sol, to build folder
    fs.outputJSONSync(
        path.resolve(buildPath,`${contract.replace(":",'')}.json`),
        output[contract]
    );
}