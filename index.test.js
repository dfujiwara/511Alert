const trigger511 = require('./index').trigger511
jest.mock('node-fetch')
const fetch = require('node-fetch')

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
                    expect(fetch.mock.calls.length).toBe(2)
                    const {body} = fetch.mock.calls[1][1]
                    const expectedBody = JSON.stringify({'value1': 'San Francisco traffic'})
                    expect(body).toBe(expectedBody)
                    expect(status).toBe(200)
                    done()
                }
            })
    })
    test('non-GET methods should be rejected', (done) => {
        trigger511(
            { method: 'POST' },
            {
                sendStatus: (status) => {
                    expect(status).toBe(405)
                    done()
                }
            })
    })
})