import React from "react";
import { getAppSettings } from "../../../../_shared/app-settings";
import { updateURLContext } from "../../../../_shared/react-contexts";
import { useTranslator } from "../../../../_shared/react-hooks";
import { ResourceTypes } from "../../../../_shared/resources";
import { GlobalMessageTransmitter, GlobalTransmitterEvent } from "../../../../_shared/helpers/message-transmitter/global-transmitter";

export const NavBarGameName: React.FC<{ gameId: number }> = ({ gameId }) => {
    const { gameSettings } = getAppSettings();
    const appSetting = gameSettings[gameId];
    const tolgeeNamespace = appSetting ? appSetting["tolgeeNamespace"] : ResourceTypes.SABA_NUMBER;
    const { t } = useTranslator([tolgeeNamespace]);

    const hanldeOnClick = (gameId) => {
        GlobalMessageTransmitter.broadcast({ [GlobalTransmitterEvent.OPEN_GAME_ID]: gameId });
        updateURLContext({ gameId });
    }


    return <div onClick={() => hanldeOnClick(gameId)} >
        {t(`${tolgeeNamespace}.game_name_${gameId}`).toUpperCase()}
    </div>;

};

