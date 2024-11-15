import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { JSX } from "react";

import { useSystemContext, useSystemDispatch } from "../../_shared/react-contexts";
import {
    GameStateProvider,
    useGameStateContext,
    useGameStatesDispatch,
} from "../../_shared/react-contexts/game-state-context/game-state-context";
import { useTranslator } from "../../_shared/react-hooks";
import GameBase from "../../components/game-base/";
import { GameMessageHandler, TurnIdHandler } from "../../components/game-base/handlers";
import { GameBaseHandlers, GameBaseProps, GameBaseState, Round } from "../../components/game-base/type";
import { PercentageStatistic } from "../../components/game-components/statistic";
import { TurnStateHandler } from "../../components/turn-base/turn-state-handler";
import NextBallBettingBlock from "./next-ball-betting-block";
import { NextBallBetOptions } from "./next-ball-constants";
import { NextGameRoundDataHandler } from "./next-ball-game-round-data-handler";
import NextBallResultBlock from "./next-ball-result-block";
import Styles from "./next-ball.module.scss";
import { NextBallResult, NextBallSettlementResult } from "./types";
import { createBeadRoadElement, createBigRoadElement, NextBallBigRoadConverter } from "./scoreboard-elements";
import { BeadRoadElement, BigRoadElement } from "../../components/game-components/round-history/scoreboard/elements";
import { SwitchableScoreboard } from "../../components/game-components/round-history/scoreboard";

const DrawIdBlock = dynamic(() => import("../../components/game-components/draw-id"));

class NextBall extends GameBase<GameBaseProps, GameBaseState> {
    private turnIdHandler?: TurnIdHandler;

    constructor(props: GameBaseProps) {
        const gameMessageHandler = new GameMessageHandler(props.dispatch);
        const gameBaseHandlers: GameBaseHandlers = {
            roundStateHandler: new TurnStateHandler(),
            gameMessageHandler: gameMessageHandler,
            gameRoundDataHandler: new NextGameRoundDataHandler(),
        };

        super(props, gameBaseHandlers);

        this.turnIdHandler = new TurnIdHandler({
            dispatch: props.dispatch,
            gameStateContextModel: this.getGameStateContext.bind(this),
            gameMessageHandler,
            totalTurns: props.totalTurns,
            durations: props.durations,
        });
    }

    override registerHandlers(): void {
        super.registerHandlers();

        this.turnIdHandler?.registerEvents();
    }

    renderResultBlock() {
        const { roundHistory, result, roundState, roundData, turnCounter, drawId, playResultAnimation, isPlayStartRoundAnimation } =
            this.props.gameStateContextModel;

        return (
            <div className={Styles["result-zone-wrapper"]}>
                <NextBallResultBlock
                    roundHistory={roundHistory as Round<NextBallResult, NextBallSettlementResult>[]}
                    result={result}
                    roundState={roundState}
                    roundData={roundData}
                    turnCounter={turnCounter}
                    drawId={drawId}
                    playResultAnimation={playResultAnimation}
                    isPlayStartRoundAnimation={isPlayStartRoundAnimation}
                />
            </div>
        );
    }

    renderBettingBlock() {
        return <NextBallBettingBlock />;
    }

    renderScoreboardPopupStatistic() {
        const { roundHistory } = this.props.gameStateContextModel;
        const { statisticGroup } = this.state;

        return (
            <PercentageStatistic
                roundHistory={roundHistory}
                mainChoices={[NextBallBetOptions.OVER, NextBallBetOptions.UNDER]}
                choicesInGroups={[[NextBallBetOptions.OVER, NextBallBetOptions.UNDER]]}
                selectedGroup={statisticGroup}
                onSelectGroup={(index: number) => this.setState({ statisticGroup: index })}
            />
        );
    }

    renderScoreboardsPopup() {
        if (!this.state.showScoreboard) {
            return <></>;
        }

        const { roundHistory, isShowBlink, playResultAnimation } = this.props.gameStateContextModel;
        const settlements = [...roundHistory].map((round) => round.settlementResult);

        isShowBlink && NextBallBigRoadConverter.addBlinkNode(settlements as any);

        return (
            <div className={Styles["scoreboard-and-statistic"]} id="big-road">
                <div className={Styles["statistic-header"]}>
                    {this.renderScoreboardPopupStatistic()}
                    <div className={`${Styles["icon-close-wrapper"]} `}>
                        <span id="icon-close" className={`${Styles["icon-close"]} `} onClick={() => this.handleToggleScoreboard()}></span>
                    </div>
                </div>
                <SwitchableScoreboard
                    className={`${Styles["custom-horizontal-scrollbar"]} ${Styles["scoreboard"]}`}
                    rounds={settlements}
                    type="switch"
                    scoreboards={[
                        {
                            element: createBigRoadElement(),
                            arrange: BigRoadElement.arrange(NextBallBigRoadConverter.getInstance()),
                            column: this.state.scoreboardColumns,
                            row: 6,
                            updateScoreboardColumns: this.updateScoreboardColumns,
                            elementClassName: Styles["scoreboard-popup-element"],
                            blockClassName: Styles["scoreboard-popup-block"],
                            scrollToRight: playResultAnimation
                        },
                    ]}
                />
            </div>
        );
    }

    renderStatistic() {
        const { roundHistory, isShowBlink } = this.props.gameStateContextModel;
        const rounds = isShowBlink ? [{}, ...roundHistory] : roundHistory;

        return (
            <div className={Styles["statistic-wrapper"]}>
                <div className={Styles["statistic"]} id="bead-road">
                    <SwitchableScoreboard
                        className={Styles["scoreboard-wrapper"]}
                        rounds={rounds}
                        type="scale"
                        scoreboards={[
                            {
                                element: createBeadRoadElement(),
                                arrange: BeadRoadElement.arrange,
                                column: this.state.statisticColumns,
                                row: 1,
                                blockClassName: Styles["scoreboard-block"],
                            },
                        ]}
                    />
                    <span
                        id="icon-statistic"
                        className={`${Styles["icon-statistic"]} `}
                        onClick={() => this.handleToggleScoreboard()}
                    ></span>
                </div>
            </div>
        );
    }
    renderRoundIdSection(): JSX.Element {
        return (
            <div className={Styles["round-id-wrapper"]}>
                <DrawIdBlock />
            </div>
        );
    }
}

const NextBallWrapper = (props) => {
    return (
        <GameStateProvider>
            <NextBallFC {...props} />
        </GameStateProvider>
    );
};

const NextBallFC = (props) => {
    const tolgeeNamespace = props["tolgeeNamespace"];
    const { t } = useTranslator([tolgeeNamespace]);

    return (
        <NextBall
            {...props}
            {...{
                dispatch: useGameStatesDispatch(),
                gameStateContextModel: useGameStateContext(),
                systemContextModel: useSystemContext(),
                systemDispatch: useSystemDispatch(),
                translate: t,
                tolgeeNamespace,
                hedgeBetGroups: [[NextBallBetOptions.OVER, NextBallBetOptions.UNDER]],
            }}
        />
    );
};

export default withRouter(NextBallWrapper);
