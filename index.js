const fetch = require('node-fetch')
const config = require('./config')

const fetch511Json = async () => {
    const response = await fetch(`http://api.511.org/Traffic/Events/?api_key=${config.apiKey}&format=json`)
    return response.text()
}

fetch511Json()
    .then((responseBody) => {
        console.log(responseBody)
    })