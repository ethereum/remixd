const https = require('https');
const fs = require('fs');

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let result = '';
            res.on('data', (data) => result += data);
            res.on('end', () => resolve(JSON.parse(result)));
            res.on('error', err => reject(err));
        })
    })
}

fetch('https://raw.githubusercontent.com/ethereum/remix-plugin/master/projects/client/assets/origins.json').then(result => {
    fs.writeFile("public/origins.json", JSON.stringify(result), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
});
