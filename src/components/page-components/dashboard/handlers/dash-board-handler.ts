import { getLobbyGameIds, getOfferGamesIds } from "../../../../_shared/helpers";
import { DashboardProps } from "../type";

export class DashboardHandler {
    constructor(
        private readonly props: DashboardProps
    ) {
    }

    checkIsNotOfferGame = () => {
        return this.props.authorizeResponse?.user?.offerGames && this.props.authorizeResponse?.user?.offerGames.length === 0;
    };

    getLobbyGamesIds = () => {
        const offerGamesIds = getOfferGamesIds(this.props.authorizeResponse);
        return getLobbyGameIds(this.props.lobbyConfigs)?.filter((gameId) => offerGamesIds.includes(gameId));
    };

    getOfferGamesIds = () => {
        return getOfferGamesIds(this.props.authorizeResponse);
    };
}
