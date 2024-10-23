import { AuthorizeResponse } from "sc-user-service-client/dist/auth";
import { ILobbyConfigs } from "../../components/page-components/dashboard/type";
import { getAppSettings } from "../app-settings";

export const defaultGameId = 1003;

export const getOfferGamesIds = (authorizeInfo: AuthorizeResponse): number[] => {
    const displayMenuGameIds = getAppSettings().displayMenuGameIds;
    const offerGamesIds =
        authorizeInfo?.user?.offerGames?.map((game: any) => +game?.gameId).filter((gameId) => displayMenuGameIds.includes(gameId)) || [];
    return offerGamesIds.length > 0 ? offerGamesIds : [defaultGameId];
};

export const getLobbyGameIds = (lobbyConfigs: ILobbyConfigs): number[] => {
    return lobbyConfigs?.categories?.[0]?.gameSettings?.map((setting) => setting.gameId);
};

export const getLobbyGamesIds = (lobbyConfigs: ILobbyConfigs, authorizeInfo: AuthorizeResponse) => {
    const offerGamesIds = getOfferGamesIds(authorizeInfo);
    return getLobbyGameIds(lobbyConfigs)?.filter((gameId) => offerGamesIds.includes(gameId));
};