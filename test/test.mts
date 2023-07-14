import { requestIP } from "../src/request-ip.mjs";
import { simulateBadNetwork } from '../src/simulate-bad-network.mjs';

const ip = '192.168.144.2'

try {
  simulateBadNetwork({ challenge: 'ip-blackhole', ip, want: false })
} catch { }

try {
  await requestIP({ ip, challenge: 'ip-blackhole', nextTickLookup: false })
} catch (e) {
  void e
}

