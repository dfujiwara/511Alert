const trigger511 = require('./index').trigger511
jest.mock('node-fetch')
const fetch = require('node-fetch')

test('non-GET methods should be rejected', () => {
    let triggeredStatus
    jest.useFakeTimers()
    trigger511(
        { method: 'POST' },
        {
            sendStatus: (status) => {
                triggeredStatus = status
            }
        })
    jest.runAllTicks()
    expect(triggeredStatus).toBe(405)
})

describe('testing', () => {
    beforeEach(() => {
        jest.useFakeTimers()
        fetch.mockImplementationOnce(() => {
            const result = {
                events: [
                    { headline: 'San Francisco traffic' },
                    { headline: 'Oakland traffic' }
                ]
            }
            return {text: () => JSON.stringify(result)}
        })
    })
    afterEach(() => {
        jest.runAllTicks()
    })
    test('GET method', (done) => {
        trigger511(
            { method: 'GET' },
            {
                sendStatus: (status) => {
                    expect(status).toBe(200)
                    done()
                }
            })
    })
})