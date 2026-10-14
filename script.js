let fields = [];
let gameOver = false;
let currentShape = 'cross';
let winner = null;

// Kreis ist Spieler 1, Kreuz Spieler 2. Fuer die Ansage im Statusbereich.
const playerNames = {
    circle: 'Player 1, circle',
    cross: 'Player 2, cross'
};

function fillFields (id) {
    if (fields[id] === undefined && !gameOver) {
        if (currentShape === 'cross') {
            currentShape = 'circle';
            document.getElementById('player1').classList.add('player-inactive');
            document.getElementById('player2').classList.remove('player-inactive');
        } else {
            currentShape = 'cross';
            document.getElementById('player2').classList.add('player-inactive');
            document.getElementById('player1').classList.remove('player-inactive');
        }

        fields[id] = currentShape;
        console.log(fields);
        draw();
        checkForWin();
        if (!gameOver) {
            announce(playerNames[currentShape === 'cross' ? 'circle' : 'cross'] + ', to move');
        }
    }
}

function restart() {
    gameOver = false;
    fields = [];
    currentShape = 'cross';
    winner = null;
    document.getElementById('gameover').classList.add('d-none');
    document.getElementById('start').classList.add('d-none');
    // Kreis beginnt immer, also ist Spieler 1 wieder dran. Sonst bleibt nach
    // einem Sieg von Kreis Spieler 2 hervorgehoben, obwohl Kreis setzt.
    document.getElementById('player1').classList.remove('player-inactive');
    document.getElementById('player2').classList.add('player-inactive');

    // Alle acht Linien, und ueber den Transform statt ueber d-none: die Linien
    // sind per CSS auf Skalierung 0 unsichtbar, nie per display. Wer sie
    // ausblendet, bekommt sie nie wieder zu sehen. Das Leeren faellt auf die
    // CSS-Regel zurueck, checkForWin schreibt die Drehung ohnehin komplett neu.
    for(let i = 1; i <= 8; i++) {
        document.getElementById('line-' + i).style.transform = '';
    }

    for(let i = 0; i < 9; i++) {
        document.getElementById('circle-' + i).classList.add('d-none');
        document.getElementById('cross-' + i).classList.add('d-none');
    }
    draw();
    announce('New game. ' + playerNames.circle + ', to move');
    // Der Start-Knopf verschwindet gerade, der Fokus soll nicht auf der Seite
    // landen, sondern wieder auf dem Brett.
    document.getElementById('field-0').focus();
}

function draw () {
    for(let i = 0; i < 9; i++) {
        if (fields[i] === 'circle') {
            document.getElementById('circle-' + i).classList.remove('d-none');
        }
        if (fields[i] === 'cross') {
            document.getElementById('cross-' + i).classList.remove('d-none');
        }
        document.getElementById('field-' + i).setAttribute('aria-label', fieldLabel(i));
    }
}

// Was ein Screenreader auf einem Feld vorliest, z. B. "Field 5, row 2, column 2, cross".
function fieldLabel(id) {
    let row = Math.floor(id / 3) + 1;
    let column = id % 3 + 1;
    return 'Field ' + (id + 1) + ', row ' + row + ', column ' + column + ', ' + (fields[id] || 'empty');
}

// Der Statusbereich ist aria-live, jede Aenderung wird vorgelesen.
function announce(text) {
    document.getElementById('status').textContent = text;
}

// Pfeiltasten wandern ueber das Brett, Tab geht ohnehin der Reihe nach.
function moveFocus(event, id) {
    let row = Math.floor(id / 3);
    let column = id % 3;
    if (event.key === 'ArrowUp') {
        row = (row + 2) % 3;
    } else if (event.key === 'ArrowDown') {
        row = (row + 1) % 3;
    } else if (event.key === 'ArrowLeft') {
        column = (column + 2) % 3;
    } else if (event.key === 'ArrowRight') {
        column = (column + 1) % 3;
    } else {
        return;
    }
    event.preventDefault();
    document.getElementById('field-' + (row * 3 + column)).focus();
}

function checkForWin () {
    if(fields[0] === fields[1] && fields[1] === fields[2] && fields[0]) {  
        winner = fields[0]; //row1
        document.getElementById('line-1').style.transform = 'scaleX(1)';
    }
    if(fields[3] === fields[4] && fields[4] === fields[5] && fields[3]) {
        winner = fields[3]; //row2
        document.getElementById('line-2').style.transform = 'scaleX(1)';
    }
    if(fields[6] === fields[7] && fields[7] === fields[8] && fields[6]) {
        winner = fields[6]; //row3
        document.getElementById('line-3').style.transform = 'scaleX(1)';
    }
    if(fields[0] === fields[3] && fields[3] === fields[6] && fields[0]) {
        winner = fields[0]; //column1
        document.getElementById('line-4').style.transform = 'rotate(90deg) scaleX(1)';
    }
    if(fields[1] === fields[4] && fields[4] === fields[7] && fields[1]) {
        winner = fields[1]; //column2
        document.getElementById('line-5').style.transform = 'rotate(90deg) scaleX(1)';
    }
    if(fields[2] === fields[5] && fields[5] === fields[8] && fields[2]) {
        winner = fields[2]; //column3
        document.getElementById('line-6').style.transform = 'rotate(90deg) scaleX(1)';
    }
    if(fields[0] === fields[4] && fields[4] === fields[8] && fields[0]) {
        winner = fields[0]; //diagonal1
        document.getElementById('line-7').style.transform = 'rotate(45deg) scaleX(1)';
    }
    if(fields[2] === fields[4] && fields[4] === fields[6] && fields[2]) {
        winner = fields[2]; //diagonal3
        document.getElementById('line-8').style.transform = 'rotate(-45deg) scaleX(1)';
    }
    if (winner) {
        console.log('You won!', winner);
        gameOver = true;
        announce(playerNames[winner] + ', wins');
        endRound();
    } else if (fields.filter(Boolean).length === 9) {
        // Volles Brett ohne Dreier. filter(Boolean) statt fields.length, weil
        // fields luecken hat: wer zuerst auf Feld 5 klickt, hat length 6.
        console.log('Draw!');
        gameOver = true;
        announce('Draw, nobody wins');
        endRound();
    }
}

function endRound() {
    setTimeout(function () {
        document.getElementById('gameover').classList.remove('d-none');
        document.getElementById('start').classList.remove('d-none');
        document.getElementById('start').focus();
    }, 500);
}