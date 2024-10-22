import {
    PFClientSeedSetting,
} from "../../../../components/game-base/type";
import { localStorageKeys, StorageHelper } from "../../../helpers";

export interface PFContextModel {
    pfClientSeedSetting?: PFClientSeedSetting;
    ownBets?: any;
    gameId: number;
    uid: number;
}

export const initialPFContextModel = ({ gameId, uid }) => {
    const defaultContext = {
        ownBets: {},
        gameId,
        uid,
        pfClientSeedSetting: {
            drawId: 0,
            randomClientSeed: "0000",
            manualClientSeed: "",
            useManualClientSeed: false,
        },
    } as PFContextModel;

    try {
        let isShowPFSetting = StorageHelper.get<string>(`${localStorageKeys.showPFSetting}`) === `${uid}-${gameId}`;
        !isShowPFSetting && StorageHelper.set(`${localStorageKeys.showPFSetting}`, '');

        const pfClientSeedSettingStorage = StorageHelper.get<PFClientSeedSetting>(`${localStorageKeys.pfSetting}-${uid}-${gameId}`);
        const isSleepMode = StorageHelper.get<boolean>(`${localStorageKeys.isSleepMode}`);

        if (!isSleepMode) {
            isShowPFSetting = false;
        }
        StorageHelper.set(localStorageKeys.isSleepMode, false);

        return {
            ...defaultContext,
            ...{ isShowPFSetting },
            ...{
                pfClientSeedSetting: {
                    ...pfClientSeedSettingStorage,
                    manualClientSeed:
                        pfClientSeedSettingStorage?.manualClientSeed?.length <= 0 && pfClientSeedSettingStorage?.useManualClientSeed
                            ? pfClientSeedSettingStorage?.randomClientSeed
                            : pfClientSeedSettingStorage?.manualClientSeed,
                }
            }
        };
    } catch (error) {
        return defaultContext;
    }
};
