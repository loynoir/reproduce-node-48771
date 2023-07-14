# reproduce-node-48771

reproduce-node-48771

## description

Unhandled 'error' event

## keyword

- un-catch-able error

- Unhandled 'error' event

- http.request with `.lookup`

## pre-test

Requirement

- command `sudo` and command `ip`, to simulate network failure

- A ip for test, which has http server on 80 port

```sh
$ curl -s 192.168.144.2 >/dev/null && echo OK
OK
```

## post-test

```sh
$ sudo ip route del blackhole 192.168.144.2
```

## expected

Because of try-catch, exit code should be zero

## actual

```sh
$ npm test

> reproduce-node-48771@1.0.0 test
> node --enable-source-maps --loader @esbuild-kit/esm-loader ./test/test.mts

(node:11977) ExperimentalWarning: Custom ESM Loaders is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
node:events:490
      throw er; // Unhandled 'error' event
      ^

Error: connect EINVAL 192.168.144.2:80 - Local (0.0.0.0:0)
    at __node_internal_captureLargerStackTrace (node:internal/errors:496:5)
    at __node_internal_exceptionWithHostPort (node:internal/errors:671:12)
    at internalConnect (node:net:1087:16)
    at defaultTriggerAsyncIdScope (node:internal/async_hooks:464:18)
    at emitLookup (node:net:1478:9)
    at lookup (/workspaces/loynoir/repo/reproduce-node-48771/src/request-ip.mts:23:21)
    at emitLookup (node:net:1402:5)
    at defaultTriggerAsyncIdScope (node:internal/async_hooks:464:18)
    at lookupAndConnectMultiple (node:net:1401:3)
    at node:net:1347:7
    at defaultTriggerAsyncIdScope (node:internal/async_hooks:464:18)
    at lookupAndConnect (node:net:1346:5)
    at Socket.connect (node:net:1243:5)
    at Agent.connect [as createConnection] (node:net:233:17)
    at Agent.createSocket (node:_http_agent:342:26)
    at Agent.addRequest (node:_http_agent:289:10)
    at new ClientRequest (node:_http_client:337:16)
    at request (node:http:101:10)
    at <anonymous> (/workspaces/loynoir/repo/reproduce-node-48771/src/request-ip.mts:14:31)
    at new Promise (<anonymous>)
    at requestIP (/workspaces/loynoir/repo/reproduce-node-48771/src/request-ip.mts:13:11)
    at <anonymous> (/workspaces/loynoir/repo/reproduce-node-48771/test/test.mts:14:11)
    at ModuleJob.run (node:internal/modules/esm/module_job:192:25)
    at async CustomizedModuleLoader.import (node:internal/modules/esm/loader:228:24)
    at async loadESM (node:internal/process/esm_loader:40:7)
    at async handleMainPromise (node:internal/modules/run_main:66:12)
Emitted 'error' event on Socket instance at:
    at emitErrorNT (node:internal/streams/destroy:151:8)
    at emitErrorCloseNT (node:internal/streams/destroy:116:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  errno: -22,
  code: 'EINVAL',
  syscall: 'connect',
  address: '192.168.144.2',
  port: 80
}

Node.js v20.4.0
```
