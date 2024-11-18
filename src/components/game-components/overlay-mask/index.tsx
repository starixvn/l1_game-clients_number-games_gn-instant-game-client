import { useEffect, useState } from "react";
import { TimeOutConstants } from "../../../_shared/constants";

export const OverlayMask = ({ removeOverlay = false, timeOut = TimeOutConstants.OverlayMask }) => {
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

    return <div className="game-over-layer"></div>;
};
