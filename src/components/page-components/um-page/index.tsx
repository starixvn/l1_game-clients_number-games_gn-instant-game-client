import { Markup } from "interweave";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { UMInfo } from "sc-user-service-client/dist/auth";
import { StorageHelper, localStorageKeys } from "../../../_shared/helpers/storage-helper";
import { convertToGMT8, formatDate } from "../../../_shared/helpers/time-helper";
import { useTranslator } from "../../../_shared/react-hooks/use-translator";
import { ResourceTypes } from "../../../_shared/resources";
import BackgroundComet from "../background-error";

const UMPage: React.FC = () => {
    const router = useRouter();
    const { t } = useTranslator();
    const [startTime, setStartTime] = useState<string>(null);
    const [endTime, setEndTime] = useState<string>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isPortrait = window.innerHeight > window.innerWidth;

    useEffect(() => {
        if (router.isReady) {
            const template = "hh:mm dd/MM/yyyy";
            const umInfo = StorageHelper.get<UMInfo>(localStorageKeys.umInfo);

            if (umInfo) {
                setStartTime(formatDate(convertToGMT8(new Date(umInfo.startTime)), template));
                setEndTime(formatDate(convertToGMT8(new Date(umInfo.endTime)), template));
            }

            setIsLoading(false);
        }
    }, [router]);

    if (isLoading) {
        return <></>;
    }
    return (
        <div className="error-page">
            <div className={`logo`} />

            <div className="star-bg" />
            <div className="planet-center" />
            <BackgroundComet />
            <div className="um-spaceman" />
            <p className="um-title">
                {t(`${ResourceTypes.COMMON}.message_sys_maintenance`)}
                {isPortrait ? <br /> : <>&nbsp;</>}
                {t(`${ResourceTypes.SABA_NUMBER}.message_um_title`)}
            </p>
        </div>
    );
};

export default UMPage;
