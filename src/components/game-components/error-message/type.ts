import { ResourceTypes } from "../../../_shared/resources";

export interface Props {
    message: string | string[];
    closeModal: Function;
}

export const ConnectFailedReasonKey = {
    lostConnection: `${ResourceTypes.INSTANT_GAME}.message_lost_game_connection`,
    restrictPlayPermission: `${ResourceTypes.INSTANT_GAME}.game_excluded`,
};
