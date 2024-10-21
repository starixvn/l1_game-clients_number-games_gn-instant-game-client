import { getLobbyGameIds, getOfferGamesIds, localStorageKeys, StorageHelper } from "../../../../_shared/helpers";
import { URLContextModel } from "../../../../_shared/react-contexts";
import { DashboardProps } from "../type";

export class DashboardHandler {
    constructor(
        private readonly props: DashboardProps
    ) {
    }

    checkIsNotOfferGame = () => {
        return this.props.authorizeResponse?.user?.offerGames && this.props.authorizeResponse?.user?.offerGames.length === 0;
    };

    shouldRenderGames = (offerGames: number[], openGameId: number) => {
        const urlContextModel = StorageHelper.get<URLContextModel>(localStorageKeys.url);
        const backToLobby = urlContextModel?.backToLobby || false;
        const ssoRedirectGameId = urlContextModel?.gameId || 0;

        return (offerGames.includes(openGameId) && !backToLobby) || ssoRedirectGameId > 0;
    };

    getLobbyGamesIds = () => {
        const offerGamesIds = getOfferGamesIds(this.props.authorizeResponse);
        return getLobbyGameIds(this.props.lobbyConfigs)?.filter((gameId) => offerGamesIds.includes(gameId));
    };

    getOfferGamesIds = () => {
        return getOfferGamesIds(this.props.authorizeResponse);
    };
}
