const addButton = document.getElementById("addCard");
const stayButton = document.getElementById("stay");
const dealerCards = document.getElementById("dealerCards");
const playerCards = document.getElementById("playerCards");

class Player {
    constructor(name, score, cards) {
        this.name = name;
        this.score = score;
        this.cards = cards
    } 
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const player = new Player('player', 0, []);
const dealer = new Player('dealer', 0, []);

function addCard(playerCardList, cardNum) {
    const li = document.createElement("li");
    const div = document.createElement("div");
    const number = document.createElement("h1");
    number.textContent = cardNum;
    div.classList.add("card");
    div.appendChild(number);
    li.appendChild(div);

    playerCardList.appendChild(li); 
}

function gameEnd() {
    //for(let card of player.cards) {
    //    addCard(playerCards, card);
    //}
    removeAllChildNodes(dealerCards);
    for(let card of dealer.cards) {
        addCard(dealerCards, card);
    }

    if(player.score == 21 || dealer.score > 21 || ((player.score > dealer.score) && player.score <= 21)) {
        setTimeout(500);
        alert(player.name + " Wins!");
    } else {
        alert(dealer.name + " Wins!");
    }
}

function draw(p, showFace) {
    let pcd = playerCards;
    if(p.name != 'player') {
        pcd = dealerCards;
    }
    const card = Math.floor(Math.random() * 11) + 1;
    p.score += card;
    console.log(pcd);
    p.cards.push(card);
    if(showFace) {
        addCard(pcd, card);
    } else {
        addCard(pcd, null);
    }

    if(p.score >= 21) {
        gameEnd();
    }

    console.log(p.score);

}

function dealerDrawTillDone() {
    while(dealer.score < 17) {
        draw(dealer, true);
    }

    gameEnd();
}

document.addEventListener("DOMContentLoaded", draw(dealer, true)); 
document.addEventListener("DOMContentLoaded", draw(dealer, false)); 
document.addEventListener("DOMContentLoaded", draw(player, true)); 
document.addEventListener("DOMContentLoaded", draw(player, true)); 
addButton.onclick = () => {draw(player, true)};
stayButton.onclick = () => {dealerDrawTillDone()};
