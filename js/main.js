'use strict';

function init() {
    console.log('loaded');
    gBoard = []
    clearInterval(ginterval)
    var imojeGame = document.querySelector('.middelDiv')
    imojeGame.innerHTML = HAPPY

    var lives = document.querySelector('.lives')
    lives.innerHTML = LIFE

    var lamps = document.querySelector('.lamps')
    lamps.innerHTML = LAMP

    var lamps = document.querySelector('.check')
    lamps.innerHTML = CHECK

    var elScore = document.querySelector('.scoreDiv')
    elScore.innerHTML = 'Score: ' + gScore

    var elWinner = document.querySelector('.winner')

    if (localStorage.length>0) {
        var theWinnerC = JSON.parse(localStorage.getItem('winnerGame'))
        
        elWinner.innerHTML = `Our Winner: ${theWinnerC.name}, with max score: ${theWinnerC.score}`
    }


    resetLL()

}

var ginterval;
var gElSelectedCell = null;
var gScore = 0
var gShowCells = 0
var gApeerCells = []

var MINE = '🎇'
var MARK = '🚩'
var HAPPY = '😃'
var WORING = '😲'
var DIY = '☠'
var WINNER = '😎'
var SAFTY = '✅'
var CHECK = ['🧐', '🧐', '🧐']
var LIFE = ['💚', '💚', '💚']
var LAMP = ['💡', '💡', '💡']

function resetLL() {
    LIFE = ['💚', '💚', '💚']
    LAMP = ['💡', '💡', '💡']
    CHECK = ['🧐', '🧐', '🧐']
    gScore = 0
}

var gBoard = []
var gLevel = {
    size: 4,
    mines: 2,
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function createBoard(size = 4, mines) {
    var elTime = document.querySelector('.timeDiv')
    var counterTime = 0
    ginterval = setInterval(() => {
        counterTime++
        elTime.innerText = 'Time: ' + counterTime
    }, 1000)

    gGame.isOn = true

    gLevel.size = size
    gLevel.mines = mines
    var cell = {}
    for (var i = 0; i < size; i++) {
        gBoard[i] = [];
        for (var j = 0; j < size; j++) {
            cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isChecked: false
            }

            gBoard[i][j] = cell
        }

    }
    for (var i = 0; i < mines; i++) {
        var randPosi = getRandomIntInclusive(0, size - 1)
        var randPosj = getRandomIntInclusive(0, size - 1)
        gBoard[randPosi][randPosj].isMine = true
    }


    console.table(gBoard);
    renderBoard(gBoard)
    return gBoard;
}


function renderBoard(gBoard) {


    var cell = {}
    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr class="board-row" >\n`
        for (var j = 0; j < gBoard[0].length; j++) {
            cell = gBoard[i][j];

            var boardCell = 'Cell ' + (i) + ',' + (j)
            if (cell.isChecked) {
                var cellInner = SAFTY
            } else if (!cell.isShown) {
                cellInner = `<img src='img/hidden.png' class'tdImg' />`
            } else {
                cellInner = content(cell, i, j)
            }
            var mac = content(cell, i, j)

            if (typeof (mac) === 'number') cell.minesAroundCount = mac


            strHTML += `\t<td class="cell imgCoverH" 
            onclick="cellClicked(this, ${i}, ${j})"
            oncontextmenu = "cellClickedR(this, ${i}, ${j})"            
            title="${boardCell}" > ${cellInner}
            </td>\n`

        }

        strHTML += `</tr>\n`
        // console.log('strHTML ', strHTML);
    }
    // fixed proplem in the consol!
    setTimeout(() => {
        var elTd = document.querySelector('.cell')
        if (cell.isMine) elTd.innerHTML = MINE
        if (cell.isMarked) elTd.innerHTML = `<img src='img/selected.png' class'tdImg' />`
    }, 1500)


    // console.log(strHTML)

    var elTable = document.querySelector('.tableGame');
    elTable.innerHTML = strHTML;
}



function content(pos, i, j) {
    var myPos = { i: i, j: j }
    var contentCell = minesAroundCountFun(myPos)

    if (pos.isMine) {
        contentCell = MINE
    } else if (pos.isMarked) {
        contentCell = MARK
    }
    return contentCell

}

function cellClicked(elCell, i, j) {
    if (gShowCells === 1) {
        showCells(i, j)
        return
    }
    var myPos = { i: i, j: j }
    if (LIFE.length === 0) return
    var cell = gBoard[i][j]
    if (cell.minesAroundCount === 0 && !cell.isMine && !cell.isShown) cellsAroundSafty(myPos)
    if (cell.isMarked) {
        cell.isMarked = false
        renderBoard(gBoard)
        return
    }
    if (cell.isChecked) cell.isChecked = false
    if (cell.isShown) return

    cell.isShown = true
    content(cell, i, j)
    renderBoard(gBoard)
    var elScore = document.querySelector('.scoreDiv')
    if (!cell.isMine) {
        gScore++
    } else {
        loseLife(cell)
    }
    elScore.innerHTML = 'Score: ' + gScore

    checkWinner()
}

function cellClickedR(elCell, i, j) {
    if (LIFE.length === 0) return
    var cell = gBoard[i][j]
    if (cell.isShown) return
    if (cell.isMarked) {
        cell.isMarked = false
        elCell.innerHTML = `<img src='img/hidden.png' class'tdImg' />`
    } else {
        cell.isMarked = true
        elCell.innerHTML = MARK
    }
    checkWinner()

}

function checkWinner() {
    var counter = 0
    var counterWinner = 0
    var ourWinner = ''

    for (var i = 0; i < (gBoard.length); i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            counter++
            var cell = gBoard[i][j]
            if (cell.isShown) {
                counterWinner++
            }
            if (cell.isMine && cell.isShown) {
                counterWinner++
            }
            if (cell.isMarked && cell.isMine) {
                counterWinner++
            }
        }
    }
    if (counterWinner >= counter) {
        clearInterval(ginterval)
        var imojeGame = document.querySelector('.middelDiv')
        imojeGame.innerHTML = 'You are winner!!'
        var theWinnerC;            
        var elModal = document.querySelector('.modal')
        var elModalMsg = document.querySelector('.modal h3')
        var elWinner = document.querySelector('.winner')

        var theWinnerC = JSON.parse(localStorage.getItem('winnerGame'))
        if(!localStorage.length>0){
            ourWinner = prompt('You Are Our Winner, What is your name?')
            var localData = { name: ourWinner, score: gScore }
            localStorage.setItem('winnerGame', JSON.stringify(localData))
        }else if (counterWinner > theWinnerC.score) {
            ourWinner = prompt('You Are Our Winner, What is your name?')
            var localData = { name: ourWinner, score: gScore }
            localStorage.setItem('winnerGame', JSON.stringify(localData))
            if (localStorage.length>0) {
                theWinnerC = JSON.parse(localStorage.getItem('winnerGame')) 
                elWinner.innerHTML = `Our Winner: ${theWinnerC.name}, with max score: ${theWinnerC.score}`
            }
            elModal.style.display = 'block'
            elModalMsg.innerHTML = 'You Won and the GAME is OVER'
            setTimeout(()=>{elModal.style.display = 'none'},5000)
        }


    }

}







function minesAroundCountFun(pos) {
    var count = 0
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (pos.i === i && pos.j === j) continue;
            var cell = gBoard[i][j]
            if (cell.isMine) {
                count++
            }
        }
    }
    //console.log('count ', count);
    return count
}

function cellsAroundSafty(pos, x) {
    var count = 0
    gApeerCells = []
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (x !== 1) {
                if (pos.i === i && pos.j === j) continue;
            }
            var cell = gBoard[i][j]
            if (gShowCells === 1 && !cell.isShown) {
                gApeerCells.push(cell)
            }
            cell.isShown = true
            count++


        }


    }
    if (count > 0) renderBoard(gBoard)
    if (gApeerCells.length > 0) return gApeerCells
}