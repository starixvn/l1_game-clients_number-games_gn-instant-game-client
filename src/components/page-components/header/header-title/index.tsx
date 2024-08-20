import React, { useEffect, useState } from "react";
import { getAppSettings } from "../../../../_shared/app-settings";
import { updateURLContext } from "../../../../_shared/react-contexts";
import { useTranslator } from "../../../../_shared/react-hooks";
import { ResourceTypes } from "../../../../_shared/resources";
import { GlobalMessageTransmitter, GlobalTransmitterEvent, registerGlobalMessageEvent, unsubscribeGlobalMessageEvent } from "../../../../_shared/helpers/message-transmitter/global-transmitter";
import Styles from "../header.module.scss";

export const NavBarGameName: React.FC<{ gameId: number }> = ({ gameId }) => {
    const { gameSettings } = getAppSettings();
    const appSetting = gameSettings[gameId];
    const tolgeeNamespace = appSetting ? appSetting["tolgeeNamespace"] : ResourceTypes.SABA_NUMBER;
    const { t } = useTranslator([tolgeeNamespace]);
    const [openingGameId, setOpeningGameId] = useState(0);

    useEffect(() => {
        const gameScriberId = registerGlobalMessageEvent(GlobalTransmitterEvent.OPEN_GAME_ID, ({ openingGameId }) => {
            setOpeningGameId(openingGameId);
        });

        return () => {
            unsubscribeGlobalMessageEvent(gameScriberId);
        };
    }, []);

    const hanldeOnClick = (gameId) => {
        GlobalMessageTransmitter.broadcast({ [GlobalTransmitterEvent.OPEN_GAME_ID]: gameId });
        updateURLContext({ gameId });
    }


    return <div className={gameId === openingGameId ? Styles["swiper-slide-active"] : Styles["swiper-slide-inactive"]} onClick={() => hanldeOnClick(gameId)} >
        {t(`${tolgeeNamespace}.game_name_${gameId}`).toUpperCase()}
    </div>;

};

