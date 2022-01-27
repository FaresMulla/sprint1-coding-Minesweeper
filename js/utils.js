
  
  // location such as: {i: 2, j: 7}
  function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
  }
  
  function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  function helpPlayer(){
      if (!gGame.isOn) return
      if (LAMP.length === 0) return
    LAMP.pop()
    var elLamps = document.querySelector('.lamps')
    if (LAMP.length === 0){
        elLamps.innerHTML = 'Helps Empty'  
    } else{
        elLamps.innerHTML = LAMP
    }
    
  }

  function checkSafty(){
    if (!gGame.isOn) return
    if (CHECK.length === 0) return
  CHECK.pop()
  var elLamps = document.querySelector('.check')
  if (CHECK.length === 0){
      elLamps.innerHTML = 'Checks Empty'  
  } else{
      elLamps.innerHTML = CHECK  
  }
  for (var i =0; i<5; i++){
    var cell = gBoard[getRandomIntInclusive(0,gLevel.size-1)][getRandomIntInclusive(0,gLevel.size-1)]
    if(!cell.isMine && !cell.isShown){
      cell.isChecked = true
      renderBoard(gBoard)
      // console.log('cell ', cell);
      setTimeout(()=>{
        cell.isChecked = false
        // console.log('cell ', cell);
        renderBoard(gBoard)
      }, 2000)
      // console.log('yesMan!');
      break 
    }
  }
}
  

  function loseLife(cell){
    var elLives = document.querySelector('.lives')
    var elScore = document.querySelector('.scoreDiv')
    if (cell.isMine){
        LIFE.pop()
        elLives.innerHTML = LIFE
        var imojeGame = document.querySelector('.middelDiv')
        imojeGame.innerHTML = WORING
        if(LIFE.length===0){
            imojeGame.innerHTML = DIY
            elLives.innerHTML = 'GAME OVER'
            gGame.isOn = false
            clearInterval(ginterval)
        } 
    }else {        
        gScore++
        elScore.innerText = 'Score: ' + gScore
    }
  }