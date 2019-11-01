#!/usr/bin/env node
const path = require('path');
const dotenv = require('dotenv');
let origins = require('../public/origins').origins;

const options = {
    path: path.resolve(process.cwd(), '.env')
};
dotenv.config(options);

if(process.env.REMIX_IDE){
    origins.push(process.env.REMIX_IDE);
}

process.env.ORIGINS = origins;
require('../src/router');