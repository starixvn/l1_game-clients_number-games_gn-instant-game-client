import React from "react";
import { useCurrentLanguage, useTranslator } from "../../../_shared/react-hooks/use-translator";
import { ResourceTypes } from "../../../_shared/resources";
import Styles from "./error-message.module.scss";
import { ConnectFailedReasonKey } from "./type";
import { useGameStateContext } from "../../../_shared/react-contexts/game-state-context/game-state-context";

export const ConnectFailedMessage: React.FC<{
    tolgeeNamespace: string;
    id: number;
    onReconnect: () => void;
    reason: string;
}> = ({ tolgeeNamespace, id, onReconnect, reason }) => {
    const { t } = useTranslator([tolgeeNamespace]);
    const { forceDisconnect } = useGameStateContext();
    const locale = useCurrentLanguage();
    if (forceDisconnect) {
        return <></>;
    }
    const isLostConnection = reason === ConnectFailedReasonKey.lostConnection;
    const renderButton = () => {
        return isLostConnection ? (
            <div className="d-flex">
                <button onClick={() => onReconnect()} className={`${Styles["btn-reconnect"]} btn-yellow`}>
                    {t(`${ResourceTypes.SABA_NUMBER}.button_reconnect`)}
                </button>
            </div>
        ) : (
            <></>
        );
    };

    return (
        <>
            <div className={`overlay-mask ${"disconnect"}`}>
                <div className={Styles[`container`]}>
                    <div className={Styles[`title`]}>{t(`${tolgeeNamespace}.game_name_${id}`)}</div>
                    <div className={`${Styles[`content`]} ${Styles[locale]}`}>
                        {t(reason, { gameName: tolgeeNamespace }).replaceTolgeeFormat().replace(tolgeeNamespace, "")}
                    </div>
                    {<div className={Styles[`action`]}>{renderButton()}</div>}
                </div>
            </div>
        </>
    );
};
