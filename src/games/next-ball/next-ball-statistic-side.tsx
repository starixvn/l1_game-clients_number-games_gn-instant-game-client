import React from "react";
import { v4 as uuidv4 } from "uuid";

import IconColumn from "../../components/game-components/round-history/icon-column";
import Styles from "../../components/game-components/round-history/icon-column/board-column.module.scss";
import { NextBallResult } from "./types";
import { useGameStateContext } from "../../_shared/react-contexts/game-state-context/game-state-context";

const NextBallStatisticSideBetDetail = (result: NextBallResult) => {
    const { roundHistory } = useGameStateContext();
    let itemValue = 0;

    if (!!result && !!result.ball) {
        itemValue = result.ball;
    }

    const isLastRound = roundHistory[0]?.drawId === result?.drawId;

    return (
        <IconColumn key={uuidv4()} isLastColumn={isLastRound}>
            <div className={Styles["board-item"]} key={uuidv4()}>
                {itemValue > 0 && (
                    <span key={uuidv4()} className={`icon-specific${itemValue} ${Styles["board-icon"]}`}>
                        <span className="path1"></span>
                    </span>
                )}
            </div>
        </IconColumn>
    );
};

export default NextBallStatisticSideBetDetail;
