import * as Sentry from "@sentry/nextjs";
import { WithRouterProps } from "next/dist/client/with-router";
import { NextRouter, useRouter } from "next/router";
import { memo, useContext, useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { AuthorizeResponse, SSOResponse } from "sc-user-service-client/dist/auth";
import { getAppSettings } from "../../../_shared/app-settings";
import { Themes, languageMapper, locales } from "../../../_shared/constants";
import { AnalyticsHelper, StorageHelper, localStorageKeys, randomInteger } from "../../../_shared/helpers";
import PreloadResources, { DURATION_HOLD_SPLASH_SCREEN, updateProgressBar } from "../../../_shared/helpers/preload-resources";
import { PlayerContextModel, URLContext, usePlayerContext } from "../../../_shared/react-contexts";
import { setSentryUser } from "../../../_shared/sentry";
import { tolgee } from "../../../_shared/tolgee";
import { authorize, createNickname, getLobbyConfigs, sso, verifySession } from "../../../services/auth-service";
import { updateSignInSMStatus } from "../../../services/user-setting-service";
import NameGenerator from "../dashboard/register/name-generator";
import { ILobbyConfigs } from "../dashboard/type";

const MAX_AVATAR_ID = 40;
export type SplashScreenProps = WithRouterProps;
export type SplashScreenState = {
    locale: string;
    underMaintenance: boolean;
};

const UMPage = dynamic(() => import("../um-page"));
const Logo = dynamic(() => import("../../page-components/splash-screen/logo"));
const Dashboard = dynamic(() => import("../dashboard"));

export const customStartup = async (
    session: SSOResponse,
    locale: string,
    router: NextRouter,
    player: PlayerContextModel,
    authorizeResponse: any
): Promise<void> => {
    const isTimeout = !session || (!session?.isUM && !session?.isAuthenticated);
    player.locale = locale;
    if (isTimeout) {
        router.push("timeout");

        return;
    }

    if (session?.isAuthenticated) {
        setSentryUser(session);
        player.session = session;
        player.authorizeInfo = authorizeResponse;
        AnalyticsHelper.setUser(session.username);
    }
};

export function onStartupError(error: Error): void {
    console.error(error);

    Sentry.captureException(error);

    globalThis.location.pathname = "timeout";
}

const isTimeoutSession = (session: SSOResponse) => {
    return !session || (!session?.isUM && !session?.isAuthenticated);
};

const getSession = async (token: string) => {
    return token ? sso(token, getAppSettings().appType) : verifySession();
};

const getLocaleFromSession = (session: SSOResponse, language: string) => {
    return languageMapper[session?.language] || languageMapper[language] || locales.en;
};

const autoCreateNickname = async (session: SSOResponse, signOut: Function) => {
    const nickname = NameGenerator.generateName();
    const maxAvatarId = MAX_AVATAR_ID;
    const selectedAvatarId = randomInteger(1, maxAvatarId);
    const authorizeResponse = (await createNickname(session, nickname, selectedAvatarId)) as AuthorizeResponse;
    if (authorizeResponse?.authorized) {
        Object.assign(authorizeResponse.user, { settings: { theme: Themes.light } });
        authorizeResponse.user.isSignedInSM = true;
        updateSignInSMStatus(session);
    } else {
        signOut?.();
    }

    return authorizeResponse;
};

const SplashScreen: React.FC = () => {
    const { gameId, token, language } = useContext(URLContext);
    const router = useRouter();
    const player = usePlayerContext();

    const [isUm, setIsUm] = useState(player?.session?.isUM);
    const [isDonePreloadResources, setIsDonePreloadResources] = useState<boolean>(false);
    const [isDoneLoadLogo, setIsDoneLoadLogo] = useState<boolean>(false);
    const [locale, setLocale] = useState<string>();
    const [currentSession, setCurrentSession] = useState<SSOResponse>();
    const [currentGameId, setCurrentGameId] = useState<number>(-1);
    const [authorizeResponse, setAuthorizeResponse] = useState<AuthorizeResponse>(null);
    const [lobbyConfigs, setLobbyConfigs] = useState<ILobbyConfigs>(null);
    const [isRenderDashboard, setIsRenderDashboard] = useState<boolean>(false);

    const signOut = () => {
        router.push("timeout");
    };

    const handleUM = (session: SSOResponse) => {
        StorageHelper.set(localStorageKeys.umInfo, session.umInfo);
        player.session = session;
        setIsUm(true);
    };

    useEffect(() => {
        let authorizeInfo;
        const handleInitialization = async () => {
            const session = await getSession(token);
            const lang = getLocaleFromSession(session, language);
            await tolgee.changeLanguage(lang);
            setLocale(lang);

            if (!session || isTimeoutSession(session)) {
                signOut();
                return;
            }

            if (session?.isUM) {
                handleUM(session);
                return;
            }

            setCurrentSession(session);
            authorizeInfo = await authorize(session);

            if (authorizeInfo.errorCode === "SB0002") {
                signOut();
                return;
            }

            if (!authorizeInfo?.authorized && session.system == 3) {
                authorizeInfo = await autoCreateNickname(session, signOut);
            }

            if (!authorizeInfo?.authorized) {
                signOut();
                return;
            }

            setCurrentGameId(gameId);

            const lobby = await getLobbyConfigs(session);

            if (lobby?.lobbyConfigs) {
                setLobbyConfigs(lobby?.lobbyConfigs);
            }

            authorizeInfo && setAuthorizeResponse(authorizeInfo);
        };

        handleInitialization();
    }, []);

    useEffect(() => {
        if (router?.isReady && isDonePreloadResources && authorizeResponse) {
            const handleStartup = async () => {
                try {
                    await customStartup(currentSession, locale, router, player, authorizeResponse);
                    setIsRenderDashboard(true);
                } catch (error) {
                    onStartupError(error);
                }
            };

            handleStartup();
        }
    }, [isDonePreloadResources, authorizeResponse]);

    useEffect(() => {
        if (player?.session?.isAuthenticated && !player?.session?.isUM) {
            updateProgressBar(100);
            setIsRenderDashboard(true);
        }
    }, [player?.session]);

    if (player?.session?.isUM || isUm) {
        return <UMPage />;
    }

    if (isRenderDashboard) {
        return (
            <Dashboard
                session={player?.session}
                setIsUm={setIsUm}
                tolgee={tolgee}
                authorizeResponse={player?.authorizeInfo}
                lobbyConfigs={lobbyConfigs}
            />
        );
    }

    return (
        <>
            {!locale ? (
                <></>
            ) : (
                <Logo
                    onLoad={() => {
                        setIsDoneLoadLogo(true);
                    }}
                />
            )}
            {isDoneLoadLogo && !!locale && (
                <PreloadResources
                    setIsDonePreload={setIsDonePreloadResources}
                    gameId={currentGameId}
                    locale={locale}
                    enablePreload={getAppSettings()?.enablePreloadResource || true}
                    durationDelayDonePreload={DURATION_HOLD_SPLASH_SCREEN}
                />
            )}
        </>
    );
};

export default memo(SplashScreen);
