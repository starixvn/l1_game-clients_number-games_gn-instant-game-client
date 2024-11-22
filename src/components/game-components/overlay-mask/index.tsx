import { useEffect, useState } from "react";
import { TimeOutConstants } from "../../../_shared/constants";

type OverlayMaskProps = {
    removeOverlay?: boolean;
    timeOut?: number;
    extraClass?: string;
};

export const OverlayMask: React.FC<OverlayMaskProps> = ({
    removeOverlay = false,
    timeOut = TimeOutConstants.OverlayMask,
    extraClass
}) => {
    const [isClearOverlayMask, setIsClearOverlayMask] = useState(false);

    useEffect(() => {
        let timeOutId = null;

        if (removeOverlay) {
            timeOutId = setTimeout(() => {
                setIsClearOverlayMask(true);
            }, timeOut);
        }

        return () => {
            timeOutId && clearTimeout(timeOutId);
        };
    }, [removeOverlay]);

    if (isClearOverlayMask) {
        return <></>;
    }

    return <div className={`game-over-layer ${extraClass}`}></div>;
};
