/* global console */
import { request } from 'node:http'
import { nextTick } from 'node:process'
import { simulateBadNetwork, type BadNetworkChallenge } from './simulate-bad-network.mjs'

interface RequestIPOption {
  challenge: BadNetworkChallenge
  ip: string
  nextTickLookup: boolean
}

async function requestIP(opt: RequestIPOption) {
  await new Promise<void>((resolve, reject) => {
    const clientRequest = request('http://example.com', {
      lookup(_hostname, _options, callback) {
        if (opt.nextTickLookup) {
          nextTick(() => {
            simulateBadNetwork({ challenge: opt.challenge, ip: opt.ip, want: true })
            callback(null, [{ address: opt.ip, family: 4 }])
          })
        } else {
          simulateBadNetwork({ challenge: opt.challenge, ip: opt.ip, want: true })
          callback(null, [{ address: opt.ip, family: 4 }])
        }
      },
    })

    const cleanup = (): void => {
      clientRequest.removeListener('error', onError)
      clientRequest.removeListener('close', onClose)
    }

    const onError = (err: Error): void => {
      cleanup()
      reject(new Error(undefined, { cause: err }))
    }

    const onClose = (): void => {
      cleanup()
      resolve()
    }

    clientRequest.addListener('error', onError)
    clientRequest.addListener('close', onClose)

    clientRequest.end()
  })
}

export { requestIP, type RequestIPOption }
