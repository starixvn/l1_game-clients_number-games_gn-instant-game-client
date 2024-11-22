import { useEffect, useState } from "react";
import Styles from "./loading-spinner.module.scss";
import { TimeOutConstants } from "../../../_shared/constants";

type LoadingSpinnerProps = {
    removeSpinner?: boolean;
    timeOut?: number;
    children?: React.ReactNode;
    extraClass?: string;
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    removeSpinner = false,
    timeOut = TimeOutConstants.OverlayMask,
    children,
    extraClass
}) => {
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
        <div className={`${Styles["spinner-container"]} ${Styles[extraClass]}`}>
            {children}
            <div className={Styles["loader"]}></div>
        </div>
    );
};
