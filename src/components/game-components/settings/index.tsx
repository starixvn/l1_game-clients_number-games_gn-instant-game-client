
import { useClickSound } from "../../../_shared/react-hooks";
import styles from "./settings.module.scss";
import { AnalyticsHelper, TrackingAction, TrackingFunction } from "../../../_shared/helpers";
import { GameEventActionType } from "../../../_shared/react-contexts/game-state-context/game-event-action";
import { useGameStateContext, useGameStatesDispatch } from "../../../_shared/react-contexts/game-state-context/game-state-context";
import { RoundState } from "../../game-base/type";

const ButtonSettingClassName = "setting-button";

export function Settings() {
    const clickSound = useClickSound();
    const dispatch = useGameStatesDispatch();
    const { roundState } = useGameStateContext();

    const switchSound = () => {
    };


    const openGuide = () => {
        if (roundState === RoundState.Disabled) {
            return;
        }

        clickSound();
        dispatch({
            type: GameEventActionType.TOGGLE_GAME_GUIDE,
            payload: {
                isShowGameGuide: true,
            },
        });
        AnalyticsHelper.trackFunction({ function: TrackingFunction.GameGuide, action: TrackingAction.Open });
    };
    return (
        <div className={styles["settings-container"]}>
            <div className={styles["setting-right"]}>
                <button className={styles[ButtonSettingClassName]} onClick={openGuide}>
                    <span id="icon-guide" className={`icon-guide ${styles["icon-guide"]}`} />
                </button>

                <button className={styles[ButtonSettingClassName]} onClick={switchSound}>
                    <span id="icon-sound" className={`icon-sound-on ${styles["icon-sound-on"]}`} />
                </button>
            </div>
        </div>
    );
}
