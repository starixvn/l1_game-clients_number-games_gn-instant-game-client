import { useEffect, useState } from "react";
import Styles from "./game-loading.module.scss";
import { TimeOutConstants } from "../../../_shared/constants";

export const LoadingSpinner = ({ removeSpinner = false, isForceReconnectService = false, timeOut = TimeOutConstants.OverlayMask }) => {
    const [isClearSpinner, setIsClearSpinner] = useState(false);

    useEffect(() => {
        let timeOutId = null;

        if (removeSpinner) {
            timeOutId = setTimeout(() => {
                setIsClearSpinner(true);
            }, timeOut);
        }

        return () => {
            timeOutId && clearTimeout(timeOutId);
        };
    }, [removeSpinner]);

    if (isClearSpinner) {
        return <></>;
    }

    return (
        <div className={Styles["spinner-container"]}>
            {isForceReconnectService && <div>The connection is unstable, please wait...</div>}
            <div className={Styles["loader"]}></div>
        </div>
    );
};
