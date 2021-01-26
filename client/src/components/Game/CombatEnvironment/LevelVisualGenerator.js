import data from '../../../data/mapSeed.json';
import React from 'react';
import styled from 'styled-components';

import combatState from '../../../state'
import globalState from '../../../state'
import { useRecoilState, useRecoilValue } from 'recoil';

import { useDispatch } from 'react-redux';
import { startReflexCheck } from '../../../actions';

import Pow from '../../Sprinkle/Pow';
import TerrainTile from './TerrainTile';


//generates the map based on the player position, enemy location, obstruction and seed
const LevelVisualGenerator = ({row, baddieCoords, playerMove, ENEMY_ATTACK_RADIUS}) => { 
  const level = useRecoilValue(globalState.level);
  const playerCoords = useRecoilValue(combatState.playerCoords);
  const playerMoveOptions = useRecoilValue(combatState.playerMoveOptions);
  const [ATTACK_RADIUS, SET_ATTACK_RADIUS] = useRecoilState(combatState.ATTACK_RADIUS);
  const [baddieDecision, setBaddieDecision] = useRecoilState(combatState.baddieDecision);

  const seed = data.find(obj => obj.level === level);
  const dispatch = useDispatch()

  const playerAction = () => {
    dispatch(startReflexCheck());    // When the player selects their action, begin a reflex check but don't advance combat round.
    SET_ATTACK_RADIUS([]);
  }

  return (
    <div key={Math.random() * 100000} style={{ display: 'flex' }}>
      {row.map((sq) => {
        if (
          seed.obstructions.find((obs) => sq.x === obs.x && sq.y === obs.y)
        ) {
          return (
            <TerrainTile
            key={Math.random() * 100000}
            type='obstacle'
            text='obstacle'>
              {
                seed.obstructions.find(
                  (obs) => sq.x === obs.x && sq.y === obs.y
                ).obstacle
              }
            </TerrainTile>
          );
        } else if (
          sq.x === baddieCoords.x &&
          sq.y === baddieCoords.y
        ) {
          return <Enemy key={Math.random() * 100000}>enemy</Enemy>;
        } else if (
          ENEMY_ATTACK_RADIUS.find((obs) => sq.x === obs.x && sq.y === obs.y)) {
            //make a useeffect that checks for player and enemy intersection instead of this damned pow component in CombatEnvironment
            if(sq.x === playerCoords.x && sq.y === playerCoords.y) {
              return (
                <Player key={Math.random() * 10000000}>
                  {sq.x}, {sq.y}
                  <Pow/>
                </Player>
              )
            } else {
              return (
                <EnemyAttackRadius key={Math.random() * 100000000}>
                  {sq.x}, {sq.y}
                </EnemyAttackRadius>
              )
            }
        } else if (
          sq.x === playerCoords.x && sq.y === playerCoords.y
          ) {
          return <Player key={Math.random() * 100000} />;
        } else if (
          ATTACK_RADIUS.find((obs) => sq.x === obs.x && sq.y === obs.y)
        ) {
          return (
            <AttackRadius
              key={Math.random() * 100000}
              onClick = {() => playerAction()}
            >
              {sq.x}, {sq.y}
            </AttackRadius>
          )
        } else if (
          playerMoveOptions.find((obs) => sq.x === obs.x && sq.y === obs.y)
        ) {
          return (
            <PossibleBox
              key={Math.random() * 100000}
              onClick={() => playerMove(sq.x, sq.y)}
            >
              {sq.x}, {sq.y}
            </PossibleBox>
          );
        } else {
          return (
            <TerrainTile
            key={Math.random() * 100000}
            type='empty'
            text={`${sq.x}, ${sq.y}`}
            >
          </TerrainTile>
          )}
        ;
      })}
    </div>
  );
}


const Box = styled.div`
  width: 50px;
  height: 50px;
  background-color: grey;
  border: 1px solid black;
  opacity: 0.5;
`;

const AttackRadius = styled.div`
  width: 50px;
  height: 50px;
  background-color: pink;
  border: 1px solid black;
  opacity: 0.5;
  cursor: pointer;
`;

const EnemyAttackRadius = styled.div`
  width: 50px;
  height: 50px;
  background-color: pink;
  border: 1px solid black;
  opacity: 0.5;
`;

const Enemy = styled.div`
  width: 50px;
  height: 50px;
  background-color: blue;
  border: 1px solid black;
  opacity: 0.5;
`;

const PossibleBox = styled.div`
  width: 50px;
  height: 50px;
  background-color: grey;
  border: 1px solid black;
  opacity: 0.9;
`;

const Player = styled.div`
  width: 50px;
  height: 50px;
  background-color: red;
  border: 1px solid black;
  opacity: 0.8;
`;

const Path = styled.div`
  width: 50px;
  height: 50px;
  background-color: yellow;
  border: 1px solid black;
  opacity: 0.8;
`;

export default LevelVisualGenerator;

