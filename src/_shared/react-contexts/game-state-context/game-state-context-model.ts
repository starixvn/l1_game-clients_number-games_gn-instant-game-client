import { GameConfigs, IUserStakeLevel, Round, RoundState } from "../../../components/game-base/type";

export interface GameStateContextModel {
    isConnect: boolean;
    signedIn: boolean;
    prevRoundState: RoundState;
    roundState: RoundState;
    gameConfigs: GameConfigs;
    roundData: any;
    roundHistory: Round<object, object>[];
    roundId: number;
    result?: any;
    settlementResult?: any;
    errorMessage?: string | string[];
    selectedBetChoice?: string;
    disabledMessage?: string;
    showResultInfo: boolean;
    showWinningAnimation: boolean;
    playResultAnimation: boolean;
    isShowBlink: boolean;
    rate?: number;
    disconnectReason?: string;
    isUMInFirstLoad: boolean;
    betWin: number;
    kickedOut: any;
    drawId: number;
    turnCounter: number;
    userStakeLevel: IUserStakeLevel;
    isPlayStartRoundAnimation?: boolean;
    availableInGameData?: boolean;
    forceDisconnect: boolean;
}

export const initialGameStateContextModel = () => {
    return {
        isConnect: false,
        signedIn: false,
        prevRoundState: RoundState.None,
        roundState: RoundState.None,
        roundData: {},
        roundHistory: [],
        roundId: 0,
        displayPopup: null,
        showResultInfo: false,
        showWinningAnimation: false,
        playResultAnimation: false,
        isShowBlink: false,
        notice: null,
        rate: 0,
        disconnectReason: "",
        gameConfigs: {
            odds: {},
            minBet: 0,
            maxBet: 0,
            maxBetPerChoices: {},
            enableFreeBet: false,
        },
        isUMInFirstLoad: false,
        betWin: 0,
        kickedOut: {},
        drawId: 0,
        result: {},
        settlementResult: {},
        turnCounter: 0,
        userStakeLevel: {
            minBet: 1,
            maxBet: 200_000,
        },
        isPlayStartRoundAnimation: false,
        availableInGameData: false,
        forceDisconnect: false,
    };
};
