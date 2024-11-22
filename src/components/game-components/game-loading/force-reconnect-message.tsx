
import { useCurrentLanguage, useSNTranslate } from "../../../_shared/react-hooks";
import Styles from "./loading-spinner.module.scss";

export const ForceReconnectMessage = () => {
    const { t } = useSNTranslate();
    const locale = useCurrentLanguage();

    return (
        <div className={`${Styles[locale]} ${Styles["force-reconnect-message"]}`}> {t("unstable_connection")}</div>
    );
};
