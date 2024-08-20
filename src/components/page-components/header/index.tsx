import "swiper/css";
import "swiper/css/pagination";

import Styles from "./header.module.scss";
import { NavBarGameName } from "./header-title";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";


export type HeaderProps = {
    lobbyGamesIds: Array<number>;
};

const Header: React.FC<HeaderProps> = ({
    lobbyGamesIds,
}) => {

    return (
        <header className={`${Styles.header}`} data-testid="header">
            <div className="game-container d-flex">
                <div className={Styles["header-container"]}>
                    <Swiper
                        // onSwiper={setThumbsSwiper}
                        spaceBetween={10}
                        slidesPerView={4}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className=""
                    >
                        {lobbyGamesIds.map((gameId) => {
                            const swipeItemId = `SwiperSlide-${gameId}`;
                            return <SwiperSlide className={Styles["swiper-slide"]} key={swipeItemId} id={swipeItemId}>
                                <NavBarGameName gameId={gameId} />
                            </SwiperSlide>;
                        })}

                    </Swiper>
                </div>
            </div>
        </header>
    );


    return (
        <header className={`${Styles.header}`} data-testid="header">
            <div className="game-container d-flex">
                <div className={Styles["header-container"]}>
                    <nav className={Styles["navigation"]}>
                        <div className={Styles["navigation-menu"]}>
                            <ul>
                                {lobbyGamesIds.map((gameId) => {
                                    const navbarItemId = `Navbar-${gameId}`;
                                    return <NavBarGameName key={navbarItemId} gameId={gameId} />;
                                })}
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );

};


export default Header;
