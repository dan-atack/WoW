// This File contains functions for the automated control of baddie movement functions:

export const baddieMoveLogic = ( baddiePosition, baddieOrientation, setBaddiePosition, playerPosition, baddie, seed) => {
  // orientationFinder returns an array that informs direction of movement logic
  // NOTE: This orientation refers to the baddie's stance relative to the player, NOT their cardinal direction
  const orientation = orientationFinder(baddiePosition, playerPosition) 

  // now that we have the orientation, 
  // and test them against the legal moves generated by their action points
  // and return an array of positions
  const possibleArray = possibleEnemyPaths(baddie, baddiePosition, seed)
  
  // now that we have the possible moves,
  // we find all the moves that would correspond to the cardinal directions
  // and return an array of moves
  const moves = moveFinder(baddiePosition, baddie, seed, orientation, possibleArray, playerPosition)
  
  // now that we have all the legal moves, we randomly select one from the array
  const randomMove = moves[Math.floor(Math.random() * moves.length)]

  // set bad guy position
  setBaddiePosition({x: baddiePosition.x + randomMove.x, y: baddiePosition.y + randomMove.y})


  console.log(
    'DEBUG LOG',
    {
      'baddie orientation': baddieOrientation,
      'baddie previous position': baddiePosition,
      'baddie position': {x: baddiePosition.x + randomMove.x, y: baddiePosition.y + randomMove.y},
      'move that baddie decided to take' : {x: randomMove.x, y: randomMove.y},
      'players orientation relative to baddie': {orientation},
    })
};

const moveFinder = (baddiePosition, baddie, seed, orientation, possibleArray, playerPosition) => { // this is what i need to fix
  let possibleMoves = []
  orientation.forEach((direction) => {
    baddie.movement.forEach(move => { // checking the json
      move.orientation.forEach(obj => { //
        if (obj === direction) {
          possibleMoves.push(move)
        }
      })
    })
  })

  // what I'm doing here is if the temp endpoint is greater or less than the map, the move is impossible, then we remove it from the array
  possibleMoves.forEach((move, index) =>{ 
    let tempEndpointX = baddiePosition.x + move.x 
    let tempEndpointY = baddiePosition.y + move.y 
    // console.log(tempEndpointX, tempEndpointY, 'tempEndpoints')

    if (
      (tempEndpointX > seed.width || tempEndpointX < 1) ||
      (tempEndpointY > seed.height || tempEndpointY < 1)
    ) {
      console.log(move, 'out of bound splice');
      possibleMoves.splice(index, 1);
    }

    seed.obstructions.forEach(obst => {
      if(obst.x === tempEndpointX && obst.y === tempEndpointY) {
        console.log(move, 'obstruction splice')
        possibleMoves.splice(index, 1)
      }
    })

    if (
      tempEndpointX === playerPosition.x &&
      tempEndpointY === playerPosition.y
    ) {
      console.log(move, 'player intersection splice')
      possibleMoves.splice(index, 1)
    }
  })

  // finally we check to see if the move is possible in the positions
  // we generated earlier

  return moveChecker(possibleMoves, possibleArray, baddiePosition);
}

const moveChecker = (possibleMoves, possibleArray, baddiePosition) => {
  //need to check my possibleMoves with possibleArray
  possibleMoves.forEach((move, index) => {
    let tempEndpoint = {x:baddiePosition.x + move.x, y:baddiePosition.y + move.y}
    if(!possibleArray.find(obj => obj.x === tempEndpoint.x && obj.y === tempEndpoint.y)) {
      console.log('impossible move splice')
      possibleMoves.splice(index, 1)
    }
  })
  return possibleMoves
}

const orientationFinder = (baddiePosition, playerPosition) => {
  const orientation = [];
  let values = {
    x : (playerPosition.x - baddiePosition.x), 
    y: (playerPosition.y - baddiePosition.y)
  }

  //show you the orientation of the directions that the baddie will go on the x axis
  switch (values.x > 0) { 
    case true: {
      orientation.push('east')
    }
    break;
    case false: {
      if(values.x < 0) {
        orientation.push('west')
      } else {
        break
      }
    }
    break;
  }

  switch (values.y > 0) {
    case true: {
      orientation.push('south')
    }
    break;
    
    case false: {
      if(values.y < 0) {
        orientation.push('north')
      } else {
        break
      }
    }
  
    default:
      break;
  }
  return orientation
}

const possibleEnemyPaths = (baddie, baddiePosition, seed) => {
  // indexing number for algorithm loop
  let moves = baddie.actionPoints; 
  
  //djikstra's to solve spaces starting at PLAYER_POS
  const possibleArray = [baddiePosition]; 
  
  for (let i = moves; i > 0; i -= 1) {
    possibleArray.forEach((node) => {
      const unsolvedSpaces = [
        { x: node.x - 1, y: node.y },
        { x: node.x + 1, y: node.y },
        { y: node.y - 1, x: node.x },
        { y: node.y + 1, x: node.x },
      ];
      unsolvedSpaces.forEach((move) => {
        //check to see if all moves are within the confines of the map
        if (
          move.x > 0 &&
          move.y > 0 &&
          move.x <= seed.width &&
          move.y <= seed.height &&
          !seed.obstructions.find((obj) => obj.x === move.x && obj.y === move.y) 
        ) {
          if (i === 0) {
            return;
          } else {
            // checks to see if the moves don't already exist in the possible moves
            if(possibleArray.find(obj => (obj.x === move.x && obj.y === move.y)) === undefined) { 
              possibleArray.push(move)
            } else {
              return
            }
          }
        } else {
          return;
        }
      });
    });
  }
  return possibleArray
}