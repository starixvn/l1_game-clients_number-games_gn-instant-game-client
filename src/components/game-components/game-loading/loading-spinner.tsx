import { useEffect, useState } from "react";
import Styles from "./game-loading.module.scss";
import { TimeOutConstants } from "../../../_shared/constants";

export const LoadingSpinner = ({ removeSpinner = false, timeOut = TimeOutConstants.OverlayMask }) => {
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
            <div className={Styles["loader"]}></div>
        </div>
    );
};
