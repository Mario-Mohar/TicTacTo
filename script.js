let fields = [];

let currentShape = 'cross';

function fillFields (id) {
    if (fields[id] === undefined) {
        if (currentShape === 'cross') {
            currentShape = 'circle';
            document.getElementById('player1').classList.remove('player-active');
            document.getElementById('player2').classList.add('player-active');
        } else {
            currentShape = 'cross';
            document.getElementById('player2').classList.add('player-active');
            document.getElementById('player1').classList.remove('player-active');
        }

        fields[id] = currentShape;
        console.log(fields);
        draw();
        checkForWin();
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
        winner = fields[0]; 
    }
    if(fields[3] === fields[4] && fields[4] === fields[5] && fields[3]) {
        winner = fields[3]; 
    }
    if(fields[7] === fields[8] && fields[8] === fields[9] && fields[7]) {
        winner = fields[7]; 
    }
    if(fields[0] === fields[3] && fields[3] === fields[6] && fields[0]) {
        winner = fields[0]; 
    }
    if(fields[1] === fields[4] && fields[4] === fields[7] && fields[1]) {
        winner = fields[1]; 
    }
    if(fields[2] === fields[5] && fields[5] === fields[8] && fields[2]) {
        winner = fields[2]; 
    }
    if(fields[0] === fields[4] && fields[4] === fields[7] && fields[0]) {
        winner = fields[0]; 
    }
    if(fields[2] === fields[4] && fields[4] === fields[6] && fields[2]) {
        winner = fields[2]; 
    }
    if (winner) {
    console.log('You won!', winner);
    }
}