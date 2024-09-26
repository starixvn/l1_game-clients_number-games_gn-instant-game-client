import { useState } from "react";
import { AnalyticsHelper, localStorageKeys, StorageHelper, TrackingAction, TrackingFunction } from "../../../_shared/helpers";
import { GameEventActionType } from "../../../_shared/react-contexts/game-state-context/game-event-action";
import { useGameStateContext, useGameStatesDispatch } from "../../../_shared/react-contexts/game-state-context/game-state-context";
import { useClickSound } from "../../../_shared/react-hooks";
import { RoundState } from "../../game-base/type";
import styles from "./settings.module.scss";

const ButtonSettingClassName = "setting-button";

export function Settings() {
    const clickSound = useClickSound();
    const dispatch = useGameStatesDispatch();
    const { roundState } = useGameStateContext();
    const [enabledSound, setEnabledSound] = useState(StorageHelper.get(localStorageKeys.enableSound) ?? true);

    const onToggleSound = () => {
        StorageHelper.set(localStorageKeys.enableSound, !enabledSound);
        setEnabledSound(!enabledSound);
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

                <button className={styles[ButtonSettingClassName]} onClick={onToggleSound}>
                    <span id="icon-sound" className={enabledSound ? `icon-sound-on` : `icon-sound-off`} />
                </button>
            </div>
        </div>
    );
}
