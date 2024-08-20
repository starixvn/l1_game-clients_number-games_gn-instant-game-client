import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";
import { isIOS, isMobileOnly } from "react-device-detect";

import { Swiper, SwiperSlide } from "swiper/react";
import { getAppSettings } from "../_shared/app-settings";
import { GameIds, SwiperNoSwiping } from "../_shared/constants";
import { AnalyticsHelper, TrackingAction, TrackingFunction } from "../_shared/helpers";
import {
    SettingEventActionType,
    SystemContextProvider,
    URLContext,
    updateURLContext,
    usePlayerContext,
    useSettingDispatch,
} from "../_shared/react-contexts";
import { useBlockBetSound, usePlaceBetSound, useStartDrawSound, useStartRoundSound } from "../_shared/react-hooks";
import { GameSound } from "../components/game-base/type";
import GameLoading from "../components/game-components/game-loading";
import { getChipSettings } from "../services/user-setting-service";
import styles from "./games.module.scss";
import { Props } from "./type";
import { GlobalTransmitterEvent, registerGlobalMessageEvent, unsubscribeGlobalMessageEvent } from "../_shared/helpers/message-transmitter/global-transmitter";

const BacBall = dynamic(() => import("./bac-ball"));
const NextBall = dynamic(() => import("./next-ball/page"));
const SwitchGamesGuide = dynamic(() => import("../components/page-components/switch-games-guide"));
const SeBall = dynamic(() => import("./se-ball/page"));
const LuckyThree = dynamic(() => import("./lucky-three/page"));
const SicBall = dynamic(() => import("./sic-ball/page"));

export const Games: React.FC<Props> = ({
    swiperRef,
    setApiErrorMessage,
    userStakeLevel,
    updateUserStakeLevel,
    openGameId,
    directMode,
    lobbyGamesIds,
}) => {
    const { isDirectMode } = useContext(URLContext);
    const { theme } = useTheme();
    const { session } = usePlayerContext();
    const settingDispatch = useSettingDispatch();
    const [openingGameId, setOpeningGameId] = useState(openGameId);

    useEffect(() => {
        (async () => {
            const chipSettings = await getChipSettings(session);
            settingDispatch({
                type: SettingEventActionType.UPDATE_CHIPS,
                payload: {
                    chipSettings: chipSettings?.chips,
                },
            });
        })();
    }, []);

    useEffect(() => {
        const gameScriberId = registerGlobalMessageEvent(GlobalTransmitterEvent.OPEN_GAME_ID, ({ openingGameId }) => {
            setOpeningGameId(openingGameId);
        });

        return () => {
            unsubscribeGlobalMessageEvent(gameScriberId);
        };
    }, []);

    const gameSound: GameSound = {
        playPlaceBetSound: usePlaceBetSound(),
        startPlaceBetSound: useStartDrawSound(),
        startRoundSound: useStartRoundSound(),
        blockBetSound: useBlockBetSound(),
    };

    const getGameComponentById = (gameId: number) => {
        const { gameSettings } = getAppSettings();

        const gameProps = {
            ...gameSettings[gameId],
            gameSound,
            setApiErrorMessage: setApiErrorMessage,
            theme,
            userStakeLevel,
            updateUserStakeLevel,
        };

        switch (gameId) {
            case GameIds.BacBall1:
            case GameIds.BacBall2:
                return <BacBall key={`game-${gameId}`} {...gameProps} />;

            case GameIds.NextBall1:
            case GameIds.NextBall2:
                return <NextBall key={`game-${gameId}`} {...gameProps} />;

            case GameIds.SeBall1:
                return <SeBall key={`game-${gameId}`} {...gameProps} />;

            case GameIds.LuckyThree:
                return <LuckyThree key={`game-${gameId}`} {...gameProps} />;

            case GameIds.SicBall:
                return <SicBall key={`game-${gameId}`} {...gameProps} />;
            default:
                return null;
        }
    };

    return (
        <div className={`game-container ${styles["game-wrapper"]} ${styles["open-chips"]}`}>
            <SystemContextProvider>
                <div className={`${styles["game-list"]} ${isMobileOnly ? styles[isIOS ? "ios-device" : "android-device"] : ""}`}>
                    {getGameComponentById(openingGameId)}
                    {!isDirectMode && isMobileOnly && <SwitchGamesGuide />}
                </div>
            </SystemContextProvider>
        </div>
    );
};

export default Games;
