let b;

class Card {
    constructor(isDealer) {
        let seed = Math.floor(Math.random() * 13) + 1
        switch(seed) {
            case 1: 
                if(!isDealer) {
                    let val = parseInt(prompt("You drew an Ace? Would you like a 1 or 11?", 1));
                    if(val == 1 || val == 11) {
                        this.value = val;
                    } else {
                        this.value = 1; 
                    }
                } else {
                    this.value = 1;
                }
                this.face = "A";
                break;
            case 11:
                this.value = 10;
                this.face = "J";
                break;
            case 12:
                this.value = 10;
                this.face = "Q";
                break;
            case 13: 
                this.value = 10;
                this.face = "K";
                break;
            default:
                this.value = seed;
                this.face = seed;
                break;
        }
    }
}

class Player {
    constructor(name) {
        this.hand = [];
        this.name = name;
        this.score = 0; 
    }

    draw() {
        this.hand.push(new Card(false));
    }

    addCard(c) {
        this.hand.push(c);
    }
}

class Game {
    constructor() {
        this.players = [];
    }

    addPlayer(p) {
        this.players.push(p);
    }
}

let socket;
const connect = function() {
    return new Promise((resolve, reject) => {
        const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
        const port = 3000;
        const socketUrl = `${socketProtocol}//${window.location.hostname}:${port}/ws/`;

        socket = new WebSocket(socketUrl);

        socket.onopen = (e) => {
            socket.send(JSON.stringify({'loaded':true}));
            resolve();
        }

        socket.onclose = (e) => {
            console.log("Socket Closed");
            resolve();
        }

        socket.onerror = (e) => {
            console.log(e);
            resolve();
            connect();
        }

        socket.onmessage = (msg) => {
            console.log(msg.data);
        }
    })
}

const isOpen = function(ws) {
    return ws.readyState === ws.OPEN;
}

document.addEventListener("DOMContentLoaded", () => {
    let g = new Game();
    let h = new Player('henry');
    g.addPlayer(h);


    g.players.forEach((p) => {
        p.draw();
    });

    console.log('hi')
    let c = new Card(false);
    console.log(c);

    console.log(h);

    connect();
    if(isOpen(socket)) {
        socket.send({"message" : JSON.stringify(g)});
    } else {
        console.log('closed');
        console.log(socket.readyState);
    }

    b = document.getElementById("buttonnn");
    b.onclick = () => {socket.send(JSON.stringify(g))};



});

