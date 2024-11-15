import { memo } from "react";
import { useLowPerformanceDevice } from "../../../_shared/react-hooks";
import { Spritesheet } from "../sprites-sheet";
import Styles from "./cage.module.scss";
import { useGameStateContext } from "../../../_shared/react-contexts/game-state-context/game-state-context";
import { RoundState } from "../../game-base/type";

const VALID_RENDER_STATES = [RoundState.InRound, RoundState.LockingBet, RoundState.BeforePlaceBet, RoundState.DisplayResult];

const BallAnimation: React.FC = () => {
    const isLowPerformanceDevice = useLowPerformanceDevice();

    return (
        <Spritesheet
            className={`fade-in ${Styles["balls-loop"]}`}
            image="/static/images/cage/cage-loop-anim.webp"
            widthFrame={130}
            heightFrame={130}
            isResponsive
            steps={11}
            autoplay
            loop
            fps={isLowPerformanceDevice ? 30 : 40}
        />
    );
};

const BallLoops: React.FC = () => {
    const { roundState } = useGameStateContext();
    const shouldRenderBalls = VALID_RENDER_STATES.includes(roundState);

    return (
        <div id="cage-balls" className={Styles["cage-balls"]}>
            {shouldRenderBalls ? <BallAnimation /> : <div className={Styles["idle-balls"]} />}
        </div>
    );
};

export default memo(BallLoops);
