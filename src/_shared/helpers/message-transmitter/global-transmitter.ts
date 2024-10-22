import messageTransmitter from ".";

export const GlobalMessageTransmitter = messageTransmitter();

export enum GlobalTransmitterEvent {
    OPEN_GAME_ID = "openingGameId",
    NOTICE = "notice",
    CLOSE_DIALOG = "closeDialog",
    ROUND_STATE = "roundState",
    TOGGLE_GAME_GUIDE = "toggleGameGuide"
}

export const registerGlobalMessageEvent = (messageKey: string, handler: Function) => {
    return GlobalMessageTransmitter.register(messageKey, handler);
};

export const unsubscribeGlobalMessageEvent = (listenerId: string) => {
    GlobalMessageTransmitter.unsubscribe(listenerId);
};
