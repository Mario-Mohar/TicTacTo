let fields = [];
let gameOver = false;
let currentShape = 'cross';

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
}
}

function restart() {
    gameOver = false;
    fields = [];
    document.getElementById('gameover').classList.add('d-none');
    document.getElementById('start').classList.add('d-none');

    for(let i = 1; i < 8; i++) {
        document.getElementById('line-' + i).classList.add('d-none');
    }

    for(let i = 0; i < 9; i++) {
        document.getElementById('circle-' + i).classList.add('d-none');
        document.getElementById('cross-' + i).classList.add('d-none');
    }
}

function draw () {
    for(let i = 0; i < fields.length; i++) {
        if (fields[i] === 'circle') {
            document.getElementById('circle-' + i).classList.remove('d-none');
        }
        if (fields[i] === 'cross') {
            document.getElementById('cross-' + i).classList.remove('d-none');
        }
    }
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
    setTimeout(function () {
        document.getElementById('gameover').classList.remove('d-none');
        document.getElementById('start').classList.remove('d-none');
    }, 500);
    }
}