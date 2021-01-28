// This File contains functions for the automated control of baddie action functions:

import { cross } from '../components/Library/attackShapeLibrary'

// Future versions of this function will eventually produce something from the baddie and player's respective positions...
export const baddieMakeDecision = (baddieCoords, playerCoords, baddie) => {
  console.log('baddie decision phase');
  // ... For now it will simply randomly select an entry from the baddie's skills list, and pass that to the Combat Env:
  const choice = baddie.skills[Math.floor(Math.random() * baddie.skills.length)];
  return choice;
};

export const baddieAction = (baddieCoords, seed, baddieDecision) => {
  console.log('baddie does their action now')
  if(baddieDecision) {
    switch (baddieDecision.name) {
      case "Crisis of Faith": 
        //shape is a cross
        return cross(baddieCoords, seed);
      case "Stigmata":
        //shape is a cross
        return cross(baddieCoords, seed);
      case "Holy Man":
        //shape is a cross
        return cross(baddieCoords, seed);
      case  "Revelations" :
        // they're all crosses! get it? ahahahaha
        return cross(baddieCoords, seed);
      default:
        console.log('error', baddieDecision);
        break;
    }
  }
}