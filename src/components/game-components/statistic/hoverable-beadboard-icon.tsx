import { useState } from "react";
import { useGameContext, usePlayerContext } from "../../../_shared/react-contexts";
import { HoverableBeadBoardIconProps } from "./types";
import Styles from "./statistic.module.scss";
import Ball, { BallSize, BallStatus } from "../ball";
import { useScreenOrientation, useTranslator } from "../../../_shared/react-hooks";
import BeadBoardIcon from "./beadboard-icon";
const HoverableBeadBoardIcon: React.FC<HoverableBeadBoardIconProps> = ({ choice, drawId, result }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isPortrait = useScreenOrientation();
    const { tolgeeNamespace } = useGameContext();
    const { t } = useTranslator([tolgeeNamespace]);

    if (!choice) {
        return null;
    }

    return (
        <div onMouseOver={() => setIsHovered(true)} onMouseOut={() => setIsHovered(false)}>
            {isHovered && !isPortrait && (
                <div className={Styles["statistic-detail-container"]}>
                    <div className={Styles["items"]}>
                        <div className={Styles["draw"]}>#{drawId}</div>
                        <div className={Styles["bottom"]}>
                            <div className={Styles["choice"]}>{t(`glossary_${choice}`)}</div>
                            <div className={Styles["result"]}>
                                {<Ball number={result} delayTime={0} status={BallStatus.SHOW} size={BallSize.SMALL} />}
                            </div>
                        </div>
                        <div className={Styles["arrow"]}></div>
                    </div>
                </div>
            )}
            <BeadBoardIcon choice={choice} />
        </div>
    );
};

export default HoverableBeadBoardIcon;
