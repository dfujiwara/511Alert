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
        sendStatus: (status) => {
          expect(fetch.mock.calls.length).toBe(2)
          const { body } = fetch.mock.calls[1][1]
          const expectedBody = JSON.stringify({ 'value1': 'San Francisco traffic' })
          expect(body).toBe(expectedBody)
          expect(status).toBe(200)
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
        sendStatus: (status) => {
          const { body } = fetch.mock.calls[1][1]
          const expectedBody = JSON.stringify({ 'value1': 'San Francisco traffic\nAnother San Francisco traffic' })
          expect(body).toBe(expectedBody)
          expect(status).toBe(200)
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
        sendStatus: (status) => {
          expect(status).toBe(200)
          expect(fetch.mock.calls.length).toBe(2)
          const { body } = fetch.mock.calls[1][1]
          const expectedBody = JSON.stringify({ 'value1': 'No relevant traffic events' })
          expect(body).toBe(expectedBody)
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
