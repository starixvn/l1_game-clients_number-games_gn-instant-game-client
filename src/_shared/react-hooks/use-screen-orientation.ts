export function isPortrait(): boolean {
    const orientation = document.querySelector('meta[name="screen-orientation"]')["content"];
    const isPortrait = orientation == "portrait";

    return isPortrait;
}

export const useScreenOrientation = () => {
    return isPortrait();
};
