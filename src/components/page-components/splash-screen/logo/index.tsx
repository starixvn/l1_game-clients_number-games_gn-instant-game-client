import Image from "next/image";
import { buildVersion } from "../../../../_shared/constants";
import { useTranslator } from "../../../../_shared/react-hooks";
import { tolgee } from "../../../../_shared/tolgee";
import Styles from "./logo.module.scss";
export const Logo = ({ onLoad }: { onLoad: Function }) => {
    const locale = tolgee.getLanguage() ?? "en";
    const { t } = useTranslator();
    const isLandscapeMode = window.innerHeight < window.innerWidth;
    const pageStyle = Styles[`${isLandscapeMode ? "page" : "page-portrait"}`];
    return (
        <div className={pageStyle}>
            <div className={Styles["center"]}>
                <div className={Styles["logo"]}>
                    <Image
                        src={`/static/images/splash-screen/2x/logo.png?v=${buildVersion}`}
                        width={195}
                        height={162}
                        alt="logo"
                        onLoad={() => {
                            onLoad();
                        }}
                        priority={true}
                    />
                </div>

                <div className={Styles["slogan"]}>{locale && t("SabaNumber.splashscreen_slogan")}</div>
            </div>

            <div className={Styles["loading"]}>
                <div className={Styles["progress"]}>
                    <div className={Styles["progress-bar"]} id="progress-bar"></div>
                </div>
                <p className={`${Styles["text-first-download"]} ${Styles[locale]}`}>{locale && t("Common.message_download_first_visit")}</p>
            </div>
        </div>
    );
};
export default Logo;
