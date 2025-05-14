const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let highestBid = 0;
let highestBidder = null;

// lista nome mesa
const nomes = ["Sam", "Milla", "Bia", "Nico", "JV", "Soph", "Joacria"];

// pegar gatinho
async function getGatinho() {
    const response = await fetch("https://api.thecatapi.com/v1/images/search?limit=1");
    const data = await response.json();
    return data[0].url;
}

// gerar valor do gatinho
function gerarNumeroAleatorioInteiro(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function initAuctionItem() {
    let numero = gerarNumeroAleatorioInteiro(1, 100);
    highestBid = numero;
    let numNome = gerarNumeroAleatorioInteiro(0, nomes.length - 1);
    const imagem = await getGatinho();

    return {
        name: nomes[numNome],
        description: "Gatinho à venda!! Miauu",
        image: imagem,
        startPrice: numero,
        timeLeft: 120
    };
}

let auctionItem = null;

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

function startAuctionTimer() {
    const timerInterval = setInterval(() => {
        auctionItem.timeLeft--;
        broadcast({ type: "timerUpdate", timeLeft: auctionItem.timeLeft });

        if (auctionItem.timeLeft <= 0) {
            clearInterval(timerInterval);
            broadcast({
                type: "auctionEnded",
                item: auctionItem.name,
                winner: highestBidder,
                winningBid: highestBid
            });
        }
    }, 1000);
}

wss.on('connection', (ws) => {
    console.log("Novo usuário conectado");

    ws.send(JSON.stringify({
        type: "init",
        item: auctionItem,
        highestBid,
        highestBidder
    }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'newBid') {
            const bidAmount = parseFloat(data.amount);
            if (bidAmount > highestBid) {
                highestBid = bidAmount;
                highestBidder = data.username;

                broadcast({
                    type: 'newHighestBid',
                    amount: highestBid,
                    bidder: highestBidder
                });
            } else {
                ws.send(JSON.stringify({
                    type: 'bidRejected',
                    message: 'Lance deve ser maior que o atual.'
                }));
            }
        }
    });

    if (wss.clients.size === 1) {
        startAuctionTimer();
    }
});

server.listen(8080, async () => {
    auctionItem = await initAuctionItem();
    console.log('Servidor WebSocket rodando na porta 8080');
});
