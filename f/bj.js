let m;
let socket;
let playerName = prompt("What is your name?");
let mainGame;

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

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
        this.stayed = false;
    }

    draw() {
        if(this.name === 'dealer') {
            let c = new Card(true);
            this.hand.push(c);
            this.score += c.value;
        } else {
            let c = new Card(false);
            this.hand.push(c);
            this.score += c.value;
        }
    }

    drawUntilDone() {
        while(this.score < 17) {
            this.draw();
        }
    }

    addCard(c) {
        this.hand.push(c);
        this.score += c.value;
    }

    stay() {
        this.stayed = true;
    }

    

}

class Game {
    constructor() {
        this.players = new Map();
        this.gameCode = "";
    }

    addPlayer(pName, pObj) {
        this.players.set(pName, pObj);
    }

    startNewGame() {
        this.addPlayer('dealer', new Player('dealer'));
        this.addPlayer(playerName, new Player(playerName));
        

        for (let [key, value] of this.players) {
            value.draw();
            value.draw();
        }
        this.gameCode = makeid(8);
        this.drawGame();
        this.allPlayersDone();
    }

    drawGame() {
        let gcodeCheck = document.getElementById('gameCode');
        if(typeof(gcodeCheck) != 'undefined' && gcodeCheck != null) {
            m.removeChild(gcodeCheck);
        }

        let gCode = document.createElement('h1');
        gCode.id = 'gameCode';      
        gCode.textContent = "Game Code: " + this.gameCode;
        m.appendChild(gCode);
        
        for (const [plname, pl] of this.players.entries()) {
            this.drawPlayer(pl);
        }
    }

    resetPlayer(playerID) {
        //TODO
    }

    updateGame(newGame) {
        this.players = newGame.players;
        this.drawGame();
    }

    updateServer() {

    }

    drawPlayer(playa) {
        let pdiv = document.getElementById(playa.name);
        if(typeof(pdiv) != 'undefined' && pdiv != null) {
            pdiv.removeChild(pdiv.firstChild);
        } else {
            pdiv = document.createElement('div'); 
        }
        
        pdiv.classList.add('playerDivs');
        pdiv.id = playa.name;

        let pinnderdiv = document.createElement('div');
        pinnderdiv.id = playa.name;

        let pn = document.createElement("h1");
        pn.textContent = playa.name;
        pn.classList.add('playerNames');
        pinnderdiv.appendChild(pn);

        let cardList = document.createElement('ul');
        for(const c of playa.hand) {
            let cc = document.createElement('div');
            cc.classList.add("card");
            let cardName = document.createElement("h1");
            cardName.textContent = c.face;
            cc.appendChild(cardName);
            cardList.appendChild(cc);
        }

        pinnderdiv.appendChild(cardList);

        if(playa.name == playerName && playa.score < 21 && !playa.stayed) {
            let hitbutton = document.createElement('button');
            let staybutton = document.createElement('button');

            hitbutton.classList.add('playerButtons');
            hitbutton.id = 'hitButton';
            hitbutton.textContent = "Hit";
            staybutton.classList.add('playerButtons');
            staybutton.id = 'stayButton';
            staybutton.textContent = 'Stay';

            hitbutton.onclick = () => {playa.draw(); this.drawPlayer(playa); this.allPlayersDone()};
            staybutton.onclick = () => {console.log('stay');playa.stay();this.allPlayersDone();  console.log(playa.stayed)};

            pinnderdiv.appendChild(hitbutton);
            pinnderdiv.appendChild(staybutton);
        }

        pdiv.appendChild(pinnderdiv);
        m.appendChild(pdiv);
    }

    allPlayersDone() {
        let allDone = true;
        for (const [plname, pl] of this.players.entries()) {
            if(plname != 'dealer' && allDone) {
                allDone = pl.score >= 21 || pl.stayed;
                console.log(pl.name + pl.stayed);
            }
        }

        console.log(allDone);

        if(allDone) {
            this.players.get('dealer').drawUntilDone();
            
            this.drawGame();
        }

    }
}


window.onload = () => {
    mainGame = new Game();
    m = document.getElementById('maindiv');
    const b = document.getElementById("startGame");
    const c = document.getElementById('joinGame');
    const j = document.getElementById('openText');
    

    b.onclick = () => {
        mainGame.startNewGame();
        c.style.display = 'none';
        b.style.display = 'none';
        j.style.display = 'none';
    };


    connect();
    if(isOpen(socket)) {
        socket.send({"message" : JSON.stringify(g)});
    } else {
        console.log('closed');
    }

};


