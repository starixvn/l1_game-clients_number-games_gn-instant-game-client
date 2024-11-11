import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslator } from "../_shared/react-hooks/use-translator";
import BackgroundComet from "../components/page-components/background-error";
import { clearSession } from "../services/auth-service";
import { ResourceTypes } from "../_shared/resources";

const TimeOut = () => {
    const { t } = useTranslator();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const isPortrait = window.innerHeight > window.innerWidth;

    useEffect(() => {
        setIsLoading(false);
        clearSession();

        (async () => {
            const audioContext: AudioContext = global.Howler?.ctx;
            audioContext && (await audioContext.close());
        })();
    }, [router.isReady]);

    if (isLoading) {
        return <></>;
    }
    return (
        <div className="error-page">
            <div className="um-background">
                <div className={`logo${isPortrait ? "" : "-landscape"}`} />

                <div className="star-bg" />
                <div className="planet-center" />
            </div>
            <BackgroundComet />
            <div className="timeout-spaceman" />
            <p className={`errorOccurred-info break timeout-msg`}>
                {t(`${ResourceTypes.INSTANT_GAME}.message_session_timeout`)}
            </p>
        </div>
    );
};

export default TimeOut;
