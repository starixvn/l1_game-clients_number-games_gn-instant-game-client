import { PFClientSeedSetting } from "../../../../components/game-base/type";

export enum PFEventActionType {
    UPDATE_PF_CLIENT_SEED_SETTING = "UPDATE_PF_CLIENT_SEED_SETTING",
    OWN_BETS = "OWN_BETS",
    SET_NEW_GAME_STATE = "SET_NEW_GAME_STATE"
}

export interface PFEventPayload {
    pfClientSeedSetting?: PFClientSeedSetting;
    ownBets?: any;
}

export interface PFEventAction {
    type: PFEventActionType;
    payload?: PFEventPayload;
}
