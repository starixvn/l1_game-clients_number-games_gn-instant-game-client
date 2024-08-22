import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useGameContext } from "../../_shared/react-contexts";
import { useGameStateContext } from "../../_shared/react-contexts/game-state-context/game-state-context";
import { isShowHighlightPrevResult } from "../../_shared/react-hooks/use-high-light";
import { RoundState } from "../../components/game-base/type";
import { BetChoiceImagesData, NextBallBetOptions } from "./next-ball-constants";
import Style from "./next-ball.module.scss";

const BetChoice = dynamic(() => import("../../components/game-components/bet-option/bet-choice"));
const RippleButton = dynamic(() => import("../../components/game-components/bet-option/ripple-button"));
const Odds = dynamic(() => import("../../components/game-components/bet-option/odds"));
const OwnBet = dynamic(() => import("../../components/game-components/bet-option/own-bet"));
const TotalBet = dynamic(() => import("../../components/game-components/bet-option/total-bet"));
const NextBallWinningAnimation = dynamic(() => import("./next-ball-winning-animation"));

const NextBallBetOptionsComponent = () => {
    const { roundState, settlementResult, showResultInfo, roundHistory, turnCounter } = useGameStateContext();
    const { tolgeeNamespace } = useGameContext();

    const isShowDisabledLayer = roundState === RoundState.LockingBet;

    const [loadingComplete, setLoadingComplete] = useState({
        [NextBallBetOptions.OVER]: false,
        [NextBallBetOptions.UNDER]: false,
    });

    const renderTotalBet = (choice: string, className?: string) => {
        return <TotalBet choice={choice} className={className} tolgeeNamespace={tolgeeNamespace} />;
    };

    const renderBetChoice = (choice: string) => {
        const className = Style[`bet-name-${choice}`];
        return <BetChoice choice={choice} className={className} tolgeeNamespace={tolgeeNamespace} />;
    };

    const renderOdds = (choice: string) => {
        return <Odds className={Style["odds"]} turnCounter={turnCounter} choice={choice} tolgeeNamespace={tolgeeNamespace} animationDuration={6} />;
    };

    const renderOwnBet = (choice: string) => {
        return <OwnBet choice={choice} tolgeeNamespace={tolgeeNamespace} className={Style["own-bet"]} />;
    };

    const renderBetInfo = (choice) => {
        const betInfoText = {
            [NextBallBetOptions.OVER]: "[38 - 75]",
            [NextBallBetOptions.UNDER]: "[1 - 37]",
        };

        const betInfoClassName = Style["bet-info"];

        if (betInfoText.hasOwnProperty(choice)) {
            return <div className={betInfoClassName}>{betInfoText[choice]}</div>;
        }

        return null;
    };

    const renderMainOption = (choice: string) => {
        const winningResult = (
            <NextBallWinningAnimation
                showResultInfo={showResultInfo}
                roundState={roundState}
                settlementResult={settlementResult}
                choice={choice}
                resourceName={NextBallBetOptions.OVER}
            />
        );
        const choiceClassName = Style[`choice-${choice}`];
        const oddsClassName = Style[`choice-${choice}`];

        return (
            <div className={`${Style[choice]} text-white relative`}>
                <Image
                    key={uuidv4}
                    className={Style["bg-bet-option"]}
                    width={207}
                    height={210}
                    src={loadingComplete[choice] ? BetChoiceImagesData[choice]?.src : BetChoiceImagesData[choice]?.blur}
                    onLoad={() => setLoadingComplete((prevState) => ({ ...prevState, [choice]: true }))}
                    alt={choice}
                    priority={true}
                />
                <div className={`${Style["choice-info"]} ${choiceClassName}`}>
                    <div className={Style.stake}>
                        {renderTotalBet(choice, Style["stake-style"])}
                    </div>
                </div>
                <div className={`${Style["choice-odds-area"]} ${oddsClassName}`}>
                    <div className={Style["choice-odds-wrapper"]}>
                        {renderBetChoice(choice)}
                        {renderOdds(choice)}
                    </div>

                    <div className={Style["bet-info-wrapper"]}>
                        {renderBetInfo(choice)}
                    </div>
                </div>

                {renderOwnBet(choice)}
                {<div className={Style["winning-effect"]}>{winningResult}</div>}

                <RippleButton className={`${Style["btn-ripple"]}`} id={`${tolgeeNamespace}-choice-${choice}`} choice={choice} />

                {isShowDisabledLayer && <div className={Style["disable-layer"]}></div>}

                {/* <div className={Style["disable-layer"]}></div> */}
                {
                    isShowHighlightPrevResult({ betChoice: choice, roundState, roundHistory }) &&
                    <div className={`${Style[`highlight-prev-result-${choice}`]} fade-in`}></div>
                }
            </div>
        );
    };

    return (
        <>
            <div className={Style["bet-option-row"]}>
                {renderMainOption(NextBallBetOptions.OVER)}
            </div>
            <div className={Style["bet-option-row"]}>
                {renderMainOption(NextBallBetOptions.UNDER)}
            </div>
        </>
    );
};

export default NextBallBetOptionsComponent;
