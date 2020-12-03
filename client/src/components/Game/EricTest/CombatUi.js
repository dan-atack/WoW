import React from 'react';
import styled from 'styled-components';
import healthbar from '../../../assets/healthbar.png';
import skillborder from '../../../assets/skillborder.png';
import menuButton from '../../../assets/menuButton.png';

import { attackRange } from '../../../Helpers/playerCombatHelper';
import data from '../../../data/mapSeed.json'
import { useDispatch, useSelector } from 'react-redux';
// recoil state management
import combatState from '../../../state'
import globalState from '../../../state'
import { useRecoilValue, useRecoilState } from 'recoil'
import { setCombatPhase } from '../../../actions';
// Components:
import ReflexCheck from '../ReflexCheck';
import playerMoves from '../../../data/playerMoves.json';


const CombatUi = ({turn, SET_ENEMY_ATTACK_RADIUS}) => {
  const [playerHealth, setPlayerHealth] = useRecoilState(combatState.health);
  const [playerHype, setPlayerHype] = useRecoilState(combatState.hype);
  const [ATTACK_RADIUS, SET_ATTACK_RADIUS] = useRecoilState(combatState.ATTACK_RADIUS);
  const [PLAYER_MOVE_OPTIONS, SET_MOVE_OPTIONS] = useRecoilState(
    combatState.PLAYER_MOVE_OPTIONS
  );
  const PLAYER_SKILLS = useRecoilValue(combatState.PLAYER_SKILLS)
  const PLAYER_POS = useRecoilValue(combatState.PLAYER_POS)
  const level = useRecoilValue(globalState.level)
  // Conditionally render reflex check based on this value:
  const doReflexCheck = useSelector((state) => state.game.reflexCheck);
  const randomMove = Math.floor(Math.random() * playerMoves.length);
  // For the initial test, we will take a random move, rather than the one specified by the button you pressed...
  const randomCombo = Math.floor(Math.random() * 3);
  const fakePreviousMoves = 0;// to simulate time-reduction for a move that is at the end of a chain of moves
  const testMove = playerMoves[randomMove];
  
  const seed = data.find(obj => obj.level === level)

  const skillClick = async (skill) => { // individual skill being called from map function
    dispatch(setCombatPhase('playerAction'))
    SET_ENEMY_ATTACK_RADIUS([])
    SET_MOVE_OPTIONS([])
    const range = await attackRange(skill, PLAYER_POS, seed.width, seed.height, seed.obstructions);
    SET_ATTACK_RADIUS(range);
  }

  const dispatch = useDispatch();

  
  return(
    <div className="Combat-UI">
      {doReflexCheck ? 
      <ReflexCheck
        move={testMove}
        combo={randomCombo}
        numPrevMoves={fakePreviousMoves}
        style={{ position: 'absolute', top: '0px', right: '50px' }}
      /> : <></>}
      <HealthHud src={healthbar}/>
      <SkillHud src={skillborder}/> 
      <Wrapper>
        <Bar type={'health'} fullness={playerHealth}>HEALTH</Bar>
        <Bar type={'hype'} fullness={playerHype}>HYPE</Bar>
      </Wrapper>
      <ButtonDiv>
        <button onClick={() => setPlayerHealth(playerHealth - 10)}>lower health</button>
        <button onClick={() => setPlayerHype(playerHype - 10)}>lower hype</button>
        <button onClick={() => setPlayerHealth(playerHealth + 10)}>increase health</button>
        <button onClick={() => setPlayerHype(playerHype + 10)}>increase hype</button>


      </ButtonDiv>
      <SkillsDiv>
        {PLAYER_SKILLS.map(skill => {
          return <Skill onClick={() => skillClick(skill)}>{skill.name}</Skill>
        })}
        { turn === 'playerAction' && <Skill onClick={() => dispatch(setCombatPhase('playerMove'))}>undo</Skill>}
      </SkillsDiv>
      <TurnDiv>{turn}</TurnDiv>
      <MenuDiv>
        <img src={menuButton} alt='menu button'/> 
      </MenuDiv>
    </div>
  )
}

const TurnDiv = styled.div`
  position: absolute;
  right: 50px;
  top: 50px;
`

const MenuDiv = styled.div`
  cursor: pointer;
  display: flex;
  position: absolute;
  bottom:0px;
  right: 0px;
  align-items: center;
  justify-content: center;
`

const Skill = styled.div`
  height: 50px;
  width: 50px;
  outline: 3px solid red;
  border-radius: 1px;
  background-color: orange;
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
  cursor: pointer;
`

const SkillsDiv = styled.div`
  display: flex;
  position: absolute;
  bottom: 18px;
  left: 19px;
`

const SkillHud = styled.img`
  position: absolute;
  bottom: 0px;
  left: 0px;
`

const ButtonDiv = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  left:0px;
  top: 200px;
`

const Wrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 57px;
`

const Bar = styled.div`
  width: ${(props) => `${props.fullness * 3}px`};
  background-color: ${(props) => 
    props.type === 'health'
    ? 'red'
  : 'purple'};
  outline: 2px solid yellow;
`

const HealthHud = styled.img`
  position: absolute;
  top: 0px;
  left: 0px;
`

export default CombatUi