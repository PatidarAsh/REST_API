const {
    Client
} = require('elasticsearch')

const client = new Client({
    host: 'localhost:9200',
    log: 'trace'
})

client.cluster.health({}, (err, resp, status) => {
    if (resp) console.log("-- Client Health -- Green");
});

module.exports = client;