import { Round } from "../../game-base/type";

export type Props = {
    children: React.ReactNode;
    value: string | number;
    className?: string;
};

export type PercentageStatisticProps = {
    roundHistory: Round<any, any>[];
    mainChoices: string[];

    choicesInGroups?: string[][];
    selectedGroup?: number;
    onSelectGroup?: Function;
    className?: string;
    subChoices?: string[];
    subChoicesClass?: {};
};

export type BeadBoardIconProps = {
    choice: string;
};

export type HoverableBeadBoardIconProps = BeadBoardIconProps & {
    drawId: number;
    result: number;
};
export type SideBetScoreboardProps = {
    roundHistory: Round<any, any>[];
    getDotDetails: Function;
};
