const trigger511 = require('./index').trigger511
jest.mock('node-fetch')
const fetch = require('node-fetch')

describe('testing', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.runAllTicks()
    fetch.mockClear()
  })
  test('GET method with single traffic notice', (done) => {
    fetch.mockImplementationOnce(() => {
      const result = {
        events: [
          { headline: 'San Francisco traffic' },
          { headline: 'Oakland traffic' }
        ]
      }
      return { text: () => JSON.stringify(result) }
    })
    trigger511(
      { method: 'GET' },
      {
        status: function (status) {
          expect(status).toBe(200)
          return this
        },
        send: (body) => {
          expect(body).toBe('San Francisco traffic')
          done()
        }
      })
  })
  test('GET method with multiple traffic notices', (done) => {
    fetch.mockImplementationOnce(() => {
      const result = {
        events: [
          { headline: 'San Francisco traffic' },
          { headline: 'Oakland traffic' },
          { headline: 'Another San Francisco traffic' }
        ]
      }
      return { text: () => JSON.stringify(result) }
    })
    trigger511(
      { method: 'GET' },
      {
        status: function (status) {
          expect(status).toBe(200)
          return this
        },
        send: (body) => {
          expect(body).toBe('San Francisco traffic\nAnother San Francisco traffic')
          done()
        }
      })
  })
  test('GET method with no traffic notices', (done) => {
    fetch.mockImplementationOnce(() => {
      const result = {
        events: [
          { headline: 'Oakland traffic' }
        ]
      }
      return { text: () => JSON.stringify(result) }
    })
    trigger511(
      { method: 'GET' },
      {
        status: function (status) {
          expect(status).toBe(200)
          return this
        },
        send: (body) => {
          expect(body).toBe('No relevant traffic events')
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
