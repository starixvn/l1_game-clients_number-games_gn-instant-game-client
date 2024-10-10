import { useEffect, useState } from "react";
import { AnalyticsHelper, localStorageKeys, StorageHelper, TrackingAction, TrackingFunction } from "../../../_shared/helpers";
import { useClickSound } from "../../../_shared/react-hooks";
import { RoundState } from "../../game-base/type";
import styles from "./settings.module.scss";
import { GlobalMessageTransmitter, GlobalTransmitterEvent, registerGlobalMessageEvent, unsubscribeGlobalMessageEvent } from "../../../_shared/helpers/message-transmitter/global-transmitter";

const ButtonSettingClassName = "setting-button";

export const Settings: React.FC<{ isLandscapeMode: boolean }> = ({ isLandscapeMode }) => {
    const clickSound = useClickSound();
    const [enabledSound, setEnabledSound] = useState(StorageHelper.get(localStorageKeys.enableSound) ?? true);
    const [roundState, setRoundState] = useState(RoundState.None);
    const [isLandscapeOrientation, setIiLandscapeOrientation] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            setIiLandscapeOrientation(window.innerHeight < window.innerWidth);
        };

        checkOrientation();

        window.addEventListener('resize', checkOrientation);

        return () => window.removeEventListener('resize', checkOrientation);
    }, []);
    const onToggleSound = () => {
        StorageHelper.set(localStorageKeys.enableSound, !enabledSound);
        setEnabledSound(!enabledSound);
    };

    useEffect(() => {
        const userInfoRedHandlerId = registerGlobalMessageEvent(GlobalTransmitterEvent.ROUND_STATE, ({ roundState }) => {
            setRoundState(roundState);
        });

        return () => {
            unsubscribeGlobalMessageEvent(userInfoRedHandlerId as any);
        };
    }, []);

    const openGuide = () => {
        if (roundState === RoundState.Disabled) {
            return;
        }

        clickSound();
        GlobalMessageTransmitter.broadcast({ [GlobalTransmitterEvent.TOGGLE_GAME_GUIDE]: true });
        AnalyticsHelper.trackFunction({ function: TrackingFunction.GameGuide, action: TrackingAction.Open });
    };

    if ((isLandscapeOrientation && isLandscapeMode) || (!isLandscapeOrientation && !isLandscapeMode)) {
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

    return null;
}
