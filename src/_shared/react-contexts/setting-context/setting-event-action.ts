import { SettingContextModel } from "./setting-context-model";

export enum SettingEventActionType {
    UPDATE_CHIPS = "UPDATE_CHIPS"
}

export interface SettingEventAction {
    type: SettingEventActionType;
    payload?: SettingContextModel;
}
