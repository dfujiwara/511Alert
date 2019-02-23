const fetch = require('node-fetch')
const config = require('./config')

const opts = {
    level: 'all',
    timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
  }
const log = require('simple-node-logger').createSimpleLogger(opts)

const fetch511Json = async () => {
    //  Currently we don't support pagination which is why we increase the limit to 50.
    const response = await fetch(`http://api.511.org/Traffic/Events/?api_key=${config.apiKey}&format=json&status=ACTIVE&in_effect_on=now&limit=50`)
    const text = await response.text()
    const trimmedText = text.trim()
    return JSON.parse(trimmedText)
}

const parse511events = (responseJson) => {
    return responseJson.events
        .map(event => {
            return event.headline
        })
}

exports.trigger511 = (req, res) => {
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
            res.sendStatus(500)
            log.error(`Encountered an error: ${error}`)
        })
}