import { Component, ReactNode, memo } from "react";
import { Round } from "../../components/game-base/type";
import { SlidableScoreboard, SwitchableScoreboard } from "../../components/game-components/round-history/scoreboard";
import { BigRoadElement } from "../../components/game-components/round-history/scoreboard/elements";
import { NextBallBigRoadConverter, createBigRoadElement } from "./scoreboard-elements";
import Styles from "./next-ball.module.scss";
import { NextBallResult, NextBallSettlementResult } from "./types";
import { PercentageStatistic } from "../../components/game-components/statistic";
import { NextBallBetOptions } from "./next-ball-constants";

export type ScoreboardAndStatisticProps = {
    roundHistory: Round<NextBallResult, NextBallSettlementResult>[];
    isShowBlink: boolean;
    statisticGroup: any;
};

export class ScoreboardAndStatistic extends Component<ScoreboardAndStatisticProps> {
    renderBigRoad(): ReactNode {
        const { roundHistory, isShowBlink, statisticGroup } = this.props;
        const settlements = [...roundHistory].map((round) => round.settlementResult);

        isShowBlink && NextBallBigRoadConverter.addBlinkNode(settlements);


        return (
            <div className={Styles["scoreboard"]} id="big-road">
                <div style={{ display: "flex" }}>
                    <PercentageStatistic
                        roundHistory={roundHistory}
                        mainChoices={[NextBallBetOptions.OVER, NextBallBetOptions.UNDER]}
                        choicesInGroups={[
                            [NextBallBetOptions.OVER, NextBallBetOptions.UNDER]
                        ]}
                        selectedGroup={statisticGroup}
                        onSelectGroup={(index: number) => this.setState({ statisticGroup: index })}
                    />
                    <div style={{ width: "300px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}> <span style={{ fontSize: "25px", color: "red", marginRight: "1rem" }}>X</span></div>

                </div>
                <SwitchableScoreboard
                    rounds={settlements}
                    type="switch"
                    scoreboards={[
                        {
                            element: createBigRoadElement(false),
                            arrange: BigRoadElement.arrange(NextBallBigRoadConverter.getInstance(false)),
                            column: 18,
                            row: 6,
                        },
                    ]}
                />
            </div>
        );
    }

    render(): ReactNode {
        return <SlidableScoreboard boards={[this.renderBigRoad()]} />;
    }
}

export default memo(ScoreboardAndStatistic);
