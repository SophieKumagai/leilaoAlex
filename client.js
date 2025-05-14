const connectionStatus = document.getElementById('connection-status');
const userSetup = document.getElementById('user-setup');
const auctionArea = document.getElementById('auction-area');
const auctionEndedMessage = document.getElementById('auction-ended-message');
const placeBidBtn = document.getElementById('place-bid-btn');
const logList = document.getElementById('log-list');

let socket;
let username = "";

document.getElementById('connect-btn').addEventListener('click', () => {
    username = document.getElementById('username').value.trim();
    if (username) {
        connectWebSocket();
    }
});

document.getElementById('place-bid-btn').addEventListener('click', () => {
    const bidAmount = parseFloat(document.getElementById('bid-amount').value);
    if (bidAmount > 0) {
        socket.send(JSON.stringify({
            type: 'newBid',
            username,
            amount: bidAmount
        }));
    }
});

function connectWebSocket() {
    socket = new WebSocket('ws://localhost:8080');

    socket.addEventListener('open', () => {
        connectionStatus.textContent = 'Conectado ao servidor como: ' + username;
        userSetup.classList.add('hidden');
        auctionArea.classList.remove('hidden');
        placeBidBtn.disabled = false;
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
            case 'init':
                updateAuctionItem(data.item);
                updateHighestBid(data.highestBid, data.highestBidder);
                break;

            case 'newHighestBid':
                updateHighestBid(data.amount, data.bidder);
                logEvent(`Novo lance de R$ ${data.amount} por ${data.bidder}`);
                break;

            case 'bidRejected':
                logEvent(`Lance rejeitado: ${data.message}`);
                break;

            case 'timerUpdate':
                updateTimer(data.timeLeft);
                break;

            case 'auctionEnded':
                showAuctionEnded(data.item, data.winner, data.winningBid);
                break;
        }
    });

    socket.addEventListener('close', () => {
        connectionStatus.textContent = 'Desconectado do servidor';
        placeBidBtn.disabled = true;
    });
}

function updateAuctionItem(item) {
    document.getElementById('item-name').textContent = item.name;
    document.getElementById('item-description').textContent = item.description;
    document.getElementById('item-image').setAttribute('src', item.image);
    document.getElementById('item-start-price').textContent = item.startPrice.toFixed(2);
}

function updateHighestBid(amount, bidder) {
    document.getElementById('highest-bid').textContent = amount.toFixed(2);
    document.getElementById('highest-bidder').textContent = bidder || '-';
}

function updateTimer(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${secs}`;
}

function showAuctionEnded(item, winner, bid) {
    auctionArea.classList.add('hidden');
    auctionEndedMessage.classList.remove('hidden');
    document.getElementById('ended-item-name').textContent = item;
    document.getElementById('winner-name').textContent = winner;
    document.getElementById('winning-bid').textContent = bid.toFixed(2);
}

function logEvent(message) {
    const li = document.createElement('li');
    li.textContent = message;
    logList.prepend(li);
}
