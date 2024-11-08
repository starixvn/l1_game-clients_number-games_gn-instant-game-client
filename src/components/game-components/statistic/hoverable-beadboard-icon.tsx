import { useGameContext } from "../../../_shared/react-contexts";
import { HoverableBeadBoardIconProps } from "./types";
import Styles from "./statistic.module.scss";
import Ball, { BallSize, BallStatus } from "../ball";
import { useScreenOrientation, useTranslator } from "../../../_shared/react-hooks";
import BeadBoardIcon from "./beadboard-icon";
import { BeadBoardTooltip } from "./statistic-styles";

const arrowColor = ' #c5a62c';

const HoverableBeadBoardIcon: React.FC<HoverableBeadBoardIconProps> = ({ choice, drawId, result }) => {
    const { tolgeeNamespace } = useGameContext();
    const isPortrait = useScreenOrientation();
    const { t } = useTranslator([tolgeeNamespace]);

    if (!choice) {
        return null;
    }

    return (
        <div data-tooltip-id={`statistic-tooltip-${drawId}`}
            data-tooltip-offset={6}
            className={Styles["statistic-tooltip"]}
        >
            <BeadBoardIcon choice={choice} />
            {
                isPortrait && <BeadBoardTooltip
                    id={`statistic-tooltip-${drawId}`}
                    arrowColor={arrowColor}
                >
                    <div className={Styles["statistic-detail-container"]}>
                        <div className={Styles["items"]}>
                            <div className={Styles["draw"]}>#{drawId}</div>
                            <div className={Styles["bottom"]}>
                                <div className={Styles["choice"]}>{t(`glossary_${choice}`).toUpperCase()}</div>
                                <div className={Styles["result"]}>
                                    {<Ball number={result} delayTime={0} status={BallStatus.SHOW} size={BallSize.SMALL} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </BeadBoardTooltip>
            }
        </div>
    );
};

export default HoverableBeadBoardIcon;
