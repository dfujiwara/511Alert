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
    const filteredEvents = responseJson.events
        .map(event => {
            return event.headline
        })
        .filter(headline => {
            return (headline.indexOf('San Francisco') != -1)
        })
    if (filteredEvents.length == 0) {
        return 'No relevant traffic events'
    }
    return filteredEvents.reduce((headlineString, headline) => {
        return `${headlineString}\n${headline}`
    })
}

const notifyIfttt = (eventSummary) => {
    return fetch(config.iftttWebHook, {
        method: 'post',
        body: JSON.stringify({ 'value1': eventSummary}),
        headers: { 'Content-Type': 'application/json' },
    })
}

exports.trigger511 = (req, res) => {
    switch (req.method) {
        case 'GET':
            break
        default:
            log.error(`${req.method} is not allowed as a method`)
            res.sendStatus(405)
            return
    }

    fetch511Json()
        .then((responseBody) => {
            const eventSummary = parse511events(responseBody)
            return notifyIfttt(eventSummary)
        })
        .then(() => {
            res.sendStatus(200)
        })
        .catch((error) => {
            log.error(`Encountered an error: ${error}`)
            res.sendStatus(500)
        })
}