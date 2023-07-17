import http from 'http';
import https from 'https';
import ProxyAgent from 'proxy-agent';

export class Proxy {
    private ip:string
    private port:number

    constructor(ip:string, port:number){
        this.ip = ip
        this.port = port
    }
}/*
const proxyHost = 'proxy-hostname-or-ip';
const proxyPort = 'proxy-port';

const proxyUrl = `http://${proxyHost}:${proxyPort}`;

const agent = new http.Agent({ 
    proxy: {
      host: proxyHost,
      port: Number(proxyPort),
    },
  });

const options = {
  hostname: 'example.com',
  path: '/',
  method: 'GET',
  agent: agent,
};

// Use either http or https module based on the URL protocol
const protocol = options.protocol === 'https:' ? https : http;

const req = protocol.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response Code:', res.statusCode);
    console.log('Response Body:', data);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.end();
*/