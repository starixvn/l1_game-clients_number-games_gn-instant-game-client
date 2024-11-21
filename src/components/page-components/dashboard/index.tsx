import "../../../games/scoreboards";
import * as Sentry from "@sentry/nextjs";

import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import React from "react";
import { isMobile } from "react-device-detect";

import ErrorCodeDictionary, { NoticeErrorCode } from "../../../_shared/constants/error-code-dictionary";
import { GetLocalizedErrorMessage, localStorageKeys, StorageHelper } from "../../../_shared/helpers";
import { PlayerContextProvider, SettingContextProvider } from "../../../_shared/react-contexts";
import { UserStakeLevel } from "../../game-base/type";
import { ModalType } from "../../game-components/base-dialog/type";
import { ErrorApiText } from "../../game-components/error-api-text";
import Styles from "./dashboard.module.scss";
import { DashboardHandler } from "./handlers/dash-board-handler";
import { NotificationHandler } from "./handlers/notification-handler";
import { DashboardProps, DashboardState } from "./type";
import Header from "../header";
import Games from "../../../games/games";

const BaseDialog = dynamic(() => import("../../game-components/base-dialog"));

class Dashboard extends React.Component<DashboardProps, DashboardState> {
    private readonly dashboardHandler: DashboardHandler;
    private readonly notificationHandler: NotificationHandler;

    constructor(
        props: DashboardProps,
        state: DashboardState,
        dashboardHandler: DashboardHandler = null,
        notificationHandler: NotificationHandler = null
    ) {
        super(props);

        this.state = {
            userStakeLevel: { minBet: 0, maxBet: 0 },
            authorizeInfo: this.props.authorizeResponse,
            isShowErrorModal: false,
            apiError: null,
            isBlockUI: false,
        };

        this.closeDialog = this.closeDialog.bind(this);
        this.showApiErrorMessage = this.showApiErrorMessage.bind(this);
        this.handleUpdateUserStakeLevel = this.handleUpdateUserStakeLevel.bind(this);
        this.signOut = this.signOut.bind(this);
        this.onVisibilityChange = this.onVisibilityChange.bind(this);
        this.updateUserBalance = this.updateUserBalance.bind(this);

        const buildId = process.env.buildVersion;
        const buildVersion = StorageHelper.get(localStorageKeys.buildVersion) ?? 0;
        if (buildId !== buildVersion) {
            Sentry.captureException(`Reload app because of new build version: ${buildId} vs ${buildVersion}`);

            StorageHelper.set(localStorageKeys.buildVersion, buildId);
            buildVersion && location.reload();
        }

        this.dashboardHandler = dashboardHandler ?? new DashboardHandler(this.props);

        this.notificationHandler =
            notificationHandler ??
            new NotificationHandler(this.props.session, this.props.setIsUm, this.updateUserBalance, this.showApiErrorMessage, this.signOut);
    }

    updateUserBalance = (balance: number) => {
        const authorizeInfo = { ...this.state.authorizeInfo };
        if (authorizeInfo.user.red !== balance) {
            authorizeInfo.user.red = balance;
            this.setState({ authorizeInfo });
        }
    };

    onVisibilityChange() {
        if (!document["hidden"]) {
            this.notificationHandler.handleReCheckIn();
        }
    }

    async componentDidMount() {
        document.addEventListener("visibilitychange", this.onVisibilityChange);

        if (this.dashboardHandler.checkIsNotOfferGame()) {
            this.setState({
                apiError: {
                    message: ErrorCodeDictionary[NoticeErrorCode.noGameOffer],
                    errorCode: "",
                },
                isShowErrorModal: true,
                isBlockUI: true,
            });
        }

        if (isMobile) {
            window.addEventListener("touchmove", this.preventZoomBehavior, { passive: false });
        }
    }

    private preventZoomBehavior(event: TouchEvent) {
        if (event.touches.length > 1) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }

    componentWillUnmount() {
        document.removeEventListener("visibilitychange", this.onVisibilityChange);
        this.notificationHandler.reset();
    }

    signOut() {
        this.props.router.push("/timeout", "/timeout", { locale: this.props.tolgee.getLanguage() });
    }

    handleUpdateUserStakeLevel(userStakeLevel: UserStakeLevel) {
        this.setState({ userStakeLevel });
    }

    showApiErrorMessage(errorCode: string) {
        this.setState({ isShowErrorModal: true, isBlockUI: false, apiError: { errorCode, message: GetLocalizedErrorMessage(errorCode) } });
    }

    closeDialog() {
        this.setState({ isShowErrorModal: false });
        this.notificationHandler.isKickOut && this.signOut();
    }

    render() {
        window.history.pushState(null, null, "/");

        const { isShowErrorModal, authorizeInfo, isBlockUI, userStakeLevel } = this.state;
        const isNoGameOffer = this.state.apiError?.message === ErrorCodeDictionary[NoticeErrorCode.noGameOffer];

        const authContextValue = {
            authorizeInfo: authorizeInfo,
            session: this.props.session,
            setBalance: this.updateUserBalance,
            signOut: this.signOut,
            fractionalOddsFormat: authorizeInfo.user?.fractionalOddsFormat ?? false,
            enableQuickBet: true,
            locale: this.props.tolgee.getLanguage(),
        };

        return (
            <PlayerContextProvider value={authContextValue}>
                <SettingContextProvider>
                    <div className={`${Styles["dashboard"]} no-scroll ${Styles["hidden-scrollbar"]}`} id={"dashboard"}>
                        <Header lobbyGamesIds={this.dashboardHandler.getLobbyGamesIds()} />

                        {isNoGameOffer ? (
                            <></>
                        ) : (
                            <Games
                                setApiErrorMessage={this.notificationHandler.handleShowApiErrorMessage}
                                userStakeLevel={userStakeLevel}
                                updateUserStakeLevel={this.handleUpdateUserStakeLevel}
                            />
                        )}

                        {isShowErrorModal && (
                            <div className={Styles["container-modal"]}>
                                <div className={`${Styles["bg-opacity"]} ${isBlockUI ? Styles["block-ui-backdrop"] : ""}`}></div>
                                <BaseDialog
                                    type={ModalType.Center}
                                    isOpen={isShowErrorModal}
                                    onCloseModal={this.closeDialog}
                                    isBlockUI={isBlockUI}
                                >
                                    <div
                                        className={`modal-center red-color ${isBlockUI ? Styles["block-ui-message"] : ""} ${
                                            isNoGameOffer ? "no-game-offer" : ""
                                        }`}
                                    >
                                        {!isBlockUI && <div className={`icon-close modal-icon-close`} onClick={this.closeDialog}></div>}
                                        <ErrorApiText
                                            errorMessage={this.state.apiError?.message}
                                            errorCode={this.state.apiError?.errorCode}
                                        />
                                    </div>
                                </BaseDialog>
                            </div>
                        )}
                    </div>
                </SettingContextProvider>
            </PlayerContextProvider>
        );
    }
}

export default withRouter(Dashboard);
