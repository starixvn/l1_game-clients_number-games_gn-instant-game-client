import { GameIds } from ".";
import { getGameSettings } from "../app-settings";

export const getDevicePixelRatio = () => {
    return (typeof window !== "undefined" && window?.devicePixelRatio) || 0;
};

export const getPathImageGameId = (gameId: number, isPortrait: boolean) => {
    const gameSettings = getGameSettings(gameId);
    const gameImagePath = gameSettings?.gameResourceConfigs?.path || "";
    const optionalGamePaths = gameSettings?.gameResourceConfigs?.optionalPaths || [];

    if (!gameImagePath) {
        return [];
    }
    const gameImageFolderByOrientation = isPortrait? "portrait":"landscape";
    return [gameImagePath, `${gameImagePath}/${gameImageFolderByOrientation}`, ...optionalGamePaths];
};


export const pathImageMapping = {
    game: [
        "cage",
        "cage/number",
        "anim/ball-middle",
        "ball",
        // "chips/gn",
        "countdown-timer",
        "dot",
        "coin-outline.svg",
        "icons",
    ],
    [GameIds.SicBall]: [
        "anim/ball-middle",
        "cage/number",
        "ball",
        // "chips/gn",
        "countdown-timer",
        "dot",
        "coin-outline.svg",
        "icons",
    ],
};
