import { spawnSync } from 'node:child_process'

type BadNetworkChallenge = null | 'reject-with-icmp-host-unreachable' | 'ip-blackhole'

function simulateBadNetwork(opt: { challenge: BadNetworkChallenge, ip: string, want: boolean }): void {
  switch (opt.challenge) {
    case 'reject-with-icmp-host-unreachable':
      if (opt.want) {
        spawnSync('sudo', [
          'iptables',
          '-A',
          'OUTPUT',
          '-d',
          `${opt.ip}/32`,
          '-m',
          'comment',
          '--comment',
          'x_test',
          '-j',
          'REJECT',
          '--reject-with',
          'icmp-host-unreachable',
        ])
      } else {
        spawnSync('sudo', [
          'iptables',
          '-D',
          'OUTPUT',
          '-d',
          `${opt.ip}/32`,
          '-m',
          'comment',
          '--comment',
          'x_test',
          '-j',
          'REJECT',
          '--reject-with',
          'icmp-host-unreachable',
        ])
      }
      break
    case 'ip-blackhole':
      if (opt.want) {
        spawnSync('sudo', ['ip', 'route', 'add', 'blackhole', `${opt.ip}`])
      } else {
        spawnSync('sudo', ['ip', 'route', 'del', 'blackhole', `${opt.ip}`])
      }
      break
    case null:
      break
    default:
      throw new Error()
  }
}

export { simulateBadNetwork, type BadNetworkChallenge }
