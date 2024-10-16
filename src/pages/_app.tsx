import "../_shared/helpers/string-helper";
import "../styles/errors.scss";
import "../styles/main.scss";

import { TolgeeProvider } from "@tolgee/react";
import { ThemeProvider } from "next-themes";
import App, { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { buildVersion, Themes } from "../_shared/constants";
import { useURLContext } from "../_shared/react-contexts";
import { tolgee } from "../_shared/tolgee";
import { LoadingSpinner } from "../components/game-components/game-loading/loading-spinner";
import { GoogleAnalytic } from "../components/page-components/google-analytics";
import { useEffect, useState } from "react";

declare global {
    interface Window {
        isLandscape: boolean;
    }
}

const SabaNumberApp = ({ Component, pageProps }: AppProps) => {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            const isLandscape = window.innerHeight < window.innerWidth;

            let scaleValue = Math.min(
                window.innerWidth / 812,
                window.innerHeight / 456
            );

            if (!isLandscape) {
                scaleValue = Math.min(
                    window.innerWidth / 448,
                    window.innerHeight / 740
                );
            }

            setScale(scaleValue);


            // console.log({
            //     scaleValue,
            //     scaleWidth: window.innerWidth / 812,
            //     scaleHeight: window.innerHeight / 456,
            //     innerHeight: window.innerHeight,
            //     innerWidth: window.innerWidth
            // })
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div
            style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                width: '100%',
                height: '100%',
            }}
        >
            <ThemeProvider defaultTheme={Themes.light} forcedTheme={Themes.light}>
                <TolgeeProvider tolgee={tolgee} fallback={<LoadingSpinner />}>
                    <AppTittle />
                    <Component {...pageProps} />
                    <GoogleAnalytic />
                </TolgeeProvider>
            </ThemeProvider>
        </div>
    );
};

export const AppTittle = () => {
    const { isThirdParty } = useURLContext();
    const [isLandscape, setIsLandscape] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            const isLandscape = window.innerHeight < window.innerWidth;
            window.isLandscape = isLandscape;
            setIsLandscape(isLandscape);
        };

        checkOrientation();

        window.addEventListener('resize', checkOrientation);

        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    return (
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta
                name="screen-orientation"
                content={isLandscape ? 'landscape' : 'portrait'}
            />
            <title>{isThirdParty ? "SABA Play" : "SABA xD"}</title>
            <link rel="shortcut icon" type="image/x-icon" href={`/favicons/favicon.ico?v=${buildVersion}`} sizes="any" />
            <link rel="icon" type="image/png" href={`/favicons/favicon2.png?v=${buildVersion}`} sizes="16x16" />
            <link rel="apple-touch-icon" type="image/png" href={`/favicons/favicon2.png?v=${buildVersion}`} sizes="any" />
        </Head>
    );
};
SabaNumberApp.getInitialProps = async (context: AppContext) => {
    const initialProps = await App.getInitialProps(context);
    return {
        ...initialProps
    };
};

export default SabaNumberApp;
