const fetch = require('node-fetch')
const config = require('./config')

const opts = {
    level: 'all',
    timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
  }
const log = require('simple-node-logger').createSimpleLogger(opts)

const fetch511Json = async () => {
    const response = await fetch(`http://api.511.org/Traffic/Events/?api_key=${config.apiKey}&format=json`)
    const text = await response.text()
    const trimmedText = text.trim()
    return JSON.parse(trimmedText)
}

const parse511events = (responseJson) => {
    responseJson.events.forEach(event => {
        console.log('event is:')
        console.log(event)
    })
    return responseJson
}

exports.helloHttp = (req, res) => {
    switch (req.method) {
        case 'GET':
            break
        default:
            res.sendStatus(405)
            log.error(`${req.method} is not allowed as a method`)
            return
    }

    fetch511Json()
        .then((responseBody) => {
            const parsedBody = parse511events(responseBody)
            res.json(parsedBody)
        })
        .catch((error) => {
            console.log(error)
        })
}