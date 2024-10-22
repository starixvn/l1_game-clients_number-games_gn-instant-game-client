import { ChipInfo } from "sc-user-service-client/dist/setting";

export interface SettingContextModel {
    chipSettings: ChipInfo[];
}

export const initialSettingContextModel = (): SettingContextModel => {
    return {
        chipSettings: []
    };
};
