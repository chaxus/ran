
import type { Client } from '../../../src/network/websocket';
import WSS from '../../../src/network/websocket'



const ws = new WSS({ port: 500 });
ws.on("connect", (cli: Client) => {
    console.log("一个客户端连接了")
    ws.broadcast("Hello! every client!"); 
    cli.send("Welcome, a user"); 
    cli.ping(); 
    cli.connectTime = Date.now(); 
    console.log('clients:', ws.clients); 
    cli.on("data", (data: string) => {
        console.log(data.toString()); 
    });
    cli.on("close", () => {
        console.log("a client closed"); 
    });
    cli.on("error", (err: Error) => {
        console.log(err.message);
    });
}); 