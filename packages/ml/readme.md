# 查看 ip 地址

`https://tool.chinaz.com/speedtest/storage.googleapis.com`

storage.googleapis.com 142.251.43.27

# Error

```sh
node_modules/.pnpm/@tensorflow+tfjs-node@4.17.0/node_modules/@tensorflow/tfjs-node: Running install script, failed in 201ms
.../node_modules/@tensorflow/tfjs-node install$ node scripts/install.js
│ CPU-darwin-4.17.0.tar.gz
│ * Downloading libtensorflow
│ https://storage.googleapis.com/tf-builds/libtensorflow_r2_7_darwin_arm64_cpu.tar.gz
│ node:events:490
│       throw er; // Unhandled 'error' event
│       ^
│ Error: read ECONNRESET
│     at TLSWrap.onStreamRead (node:internal/stream_base_commons:217:20)
│ Emitted 'error' event on ClientRequest instance at:
│     at TLSSocket.socketErrorListener (node:_http_client:496:9)
│     at TLSSocket.emit (node:events:512:28)
│     at emitErrorNT (node:internal/streams/destroy:151:8)
│     at emitErrorCloseNT (node:internal/streams/destroy:116:3)
│     at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
│   errno: -54,
│   code: 'ECONNRESET',
│   syscall: 'read'
│ }
│ Node.js v19.6.0
```

- solve

```sh
cnpm install @tensorflow/tfjs-node
```
