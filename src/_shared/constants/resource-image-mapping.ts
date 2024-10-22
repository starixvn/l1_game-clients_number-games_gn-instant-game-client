import { GameIds } from ".";
import { getGameSettings } from "../app-settings";

export const getDevicePixelRatio = () => {
    return (typeof window !== "undefined" && window?.devicePixelRatio) || 0;
};

export const getPathImageGameId = (gameId: number) => {
    const gameSettings = getGameSettings(gameId);
    const gameImagePath = gameSettings?.gameResourceConfigs?.path || "";
    const optionalGamePaths = gameSettings?.gameResourceConfigs?.optionalPaths || [];

    if (!gameImagePath) {
        return [];
    }

    const devicePixelRatioSuffix = getDevicePixelRatio() > 1 ? "/2x" : "/1x";
    return [gameImagePath, `${gameImagePath}${devicePixelRatioSuffix}`, ...optionalGamePaths];
};


export const pathImageMapping = {
    game: [
        "cage",
        "cage/number",
        "anim/ball-middle",
        "ball",
        "chips/gn",
        "countdown-timer",
        "dot",
        "coin-outline.svg",
        "icons",
    ],
    [GameIds.SicBall]: [
        "anim/ball-middle",
        "cage/number",
        "ball",
        "chips/gn",
        "countdown-timer",
        "dot",
        "coin-outline.svg",
        "icons",
    ],
};
