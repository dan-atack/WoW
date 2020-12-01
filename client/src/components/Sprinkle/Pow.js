import React from 'react';
import styled, { keyframes } from 'styled-components';

import powImg from '../../assets/pow.png';

const Pow = () => {
  const xPos = (Math.random() * 50) + 10;
  const yPos = (Math.random() * 50) + 10;

  return (
    <StyledPow src={powImg} xPos={xPos} yPos={yPos}/>
  )
}

const disappear = keyframes`
  0% {
    opacity: 1;
    display: block;
    margin-left: 200px;
    margin-top: 200px;
  };
  70% {
    opacity: 1;
    display: block;
    margin-left: 40px;
    margin-top: 40px;
  };
  100% {
    opacity: 0;
    display: none;
    margin-left: 0px;
    margin-top: 0px;
  };
`

const StyledPow = styled.img`
  animation: ${disappear} 1s 1;
  transition: all .2s linear;
  position: absolute;
  bottom: ${props => props.yPos + '%'};
  left: ${props => props.xPos + '%'};
  opacity: 0;
  z-index: -5;
`

export default Pow