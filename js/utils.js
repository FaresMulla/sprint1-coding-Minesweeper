

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function helpPlayer() {
  gShowCells = 1
  if (!gGame.isOn) return
  if (LAMP.length === 0) return
  LAMP.pop()
  var elLamps = document.querySelector('.lamps')
  if (LAMP.length === 0) {
    elLamps.innerHTML = 'Helps Empty'
  } else {
    elLamps.innerHTML = LAMP
  }
}

function showCells(i, j) {
  // console.log('yes i am here');
  if (!gGame.isOn) return
  var pos = { i: i, j: j }
  var relevantCells = cellsAroundSafty(pos, x = 1)
  console.log('relevantCells ', relevantCells);
  for (var i = 0; i < relevantCells.length; i++) {
    relevantCells[i].isShown = true
  }
  renderBoard(gBoard)

  setTimeout(() => {
    for (var i = 0; i < relevantCells.length; i++) {
      relevantCells[i].isShown = false
    }
    renderBoard(gBoard)
  }, 2000)
  gApeerCells = []
  gShowCells = 0
}

function checkSafty() {
  if (!gGame.isOn) return
  if (CHECK.length === 0) return
  CHECK.pop()
  var elLamps = document.querySelector('.check')
  if (CHECK.length === 0) {
    elLamps.innerHTML = 'Checks Empty'
  } else {
    elLamps.innerHTML = CHECK
  }
  for (var i = 0; i < 5; i++) {
    var cell = gBoard[getRandomIntInclusive(0, gLevel.size - 1)][getRandomIntInclusive(0, gLevel.size - 1)]
    if (!cell.isMine && !cell.isShown) {
      cell.isChecked = true
      renderBoard(gBoard)
      // console.log('cell ', cell);
      setTimeout(() => {
        cell.isChecked = false
        // console.log('cell ', cell);
        renderBoard(gBoard)
      }, 2000)
      // console.log('yesMan!');
      break
    }
  }
}


function loseLife(cell) {
  var elLives = document.querySelector('.lives')
  var elScore = document.querySelector('.scoreDiv')

  var elModal = document.querySelector('.modal')
  var elModalMsg = document.querySelector('.modal h3')
  var elModalbtn = document.querySelector('.modal button')
  if (cell.isMine) {
    LIFE.pop()
    elLives.innerHTML = LIFE
    var imojeGame = document.querySelector('.middelDiv')
    imojeGame.innerHTML = WORING
    if (LIFE.length === 0) {
      imojeGame.innerHTML = DIY
      elLives.innerHTML = 'GAME OVER'
      gGame.isOn = false
      clearInterval(ginterval)
      elModal.style.display = 'block'
      elModalbtn.style.display = 'none'
      elModalMsg.innerHTML = 'You Lose and the GAME is OVER'
      setTimeout(()=>{elModal.style.display = 'none'},5000)
    }
  } else {
    gScore++
    elScore.innerText = 'Score: ' + gScore
  }
}


function removeC() {
  if (localStorage.length > 0) {
    localStorage.removeItem('winnerGame')
  }
}