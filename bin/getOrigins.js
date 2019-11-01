const fs = require('fs');
const axios = require('axios');

axios.get('https://raw.githubusercontent.com/ethereum/remix-plugin/master/projects/client/assets/origins.json')
    .then(function (response) {
        console.log(response.data);

        fs.writeFile("public/origins.json", JSON.stringify(response.data), function(err) {

            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    });
