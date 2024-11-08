import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';

export const BeadBoardTooltip = styled(ReactTooltip)`
  border-radius: 1.5rem !important;
  border: ${(props) => props.arrowColor} 2px solid;
  width: fit-content;
  height: fit-content;
  padding: 0 !important;
  z-index: 999;

  &.place-top::after {
    border-top-color: ${(props) => props.arrowColor} !important;
  }
  &.place-bottom::after {
    border-bottom-color: ${(props) => props.arrowColor} !important;
  }
  &.place-left::after {
    border-left-color: ${(props) => props.arrowColor} !important;
  }
  &.place-right::after {
    border-right-color: ${(props) => props.arrowColor} !important;
  }
`;