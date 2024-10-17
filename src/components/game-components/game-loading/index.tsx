import React from "react";

import Styles from "./game-loading.module.scss";
import { useScreenOrientation } from "../../../_shared/react-hooks";

const GameLoading: React.FC<{}> = () => {
    const classSkeletonItemStyle = Styles["skeleton-item"];

    const isPortrait = useScreenOrientation();
    return (
        <div className={`${Styles["container"]}`} data-testid="game-loading">
            <div className={`${Styles["header"]}`}>
                <div className={`${Styles["round-id"]} ${Styles["border-radius-5"]} ${classSkeletonItemStyle} `} />
                {isPortrait ? (
                    <>
                        <div className={`${Styles["countdown-timer"]} ${classSkeletonItemStyle}`} />
                        <div className={`${Styles["header-right"]}`}>
                            <div className={`${Styles["game-guide"]} ${classSkeletonItemStyle}`} />
                            <div className={`${Styles["sound"]} ${classSkeletonItemStyle}`} />
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>
            {isPortrait ? (
                <>
                    <div className={Styles["result-container"]}>
                        <div className={`${classSkeletonItemStyle} ${Styles["full-size"]}`} />
                    </div>
                    <div className={Styles["bet-container"]}>
                        <div className={`${classSkeletonItemStyle} ${Styles["full-size"]}`} />
                    </div>
                </>
            ) : (
                <div className={`${Styles["play-game-container"]}`}>
                    <div className={`${classSkeletonItemStyle} ${Styles["full-size"]}`} />
                </div>
            )}
            <div className={`${Styles["statistic-container"]}`}>
                <div className={`${Styles["statistic"]} ${classSkeletonItemStyle} `} />
                <div className={`${Styles["statistic-icon"]} ${classSkeletonItemStyle}`} />
            </div>
            <div className={`${Styles["chip-container"]}`}>
                <div className={`${classSkeletonItemStyle} ${Styles["full-size"]}`} />
            </div>
        </div>
    );
};

export default GameLoading;
