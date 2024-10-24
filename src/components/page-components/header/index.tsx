import "swiper/css";
import "swiper/css/pagination";

import Styles from "./header.module.scss";
import { NavBarGameName } from "./header-title";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import { Settings } from "../../game-components/settings";

export type HeaderProps = {
    lobbyGamesIds: Array<number>;
};

const Header: React.FC<HeaderProps> = ({
    lobbyGamesIds,
}) => {
    const [initialSlide, setInitialSlide] = useState(4);
    const swiperContainerRef = useRef(null);

    useEffect(() => {
        const savedSlideIndex = localStorage.getItem('currentSlide');
        if (savedSlideIndex !== null) {
            setInitialSlide(parseInt(savedSlideIndex, 10));
        }

        const savedScrollPosition = localStorage.getItem('scrollPosition');
        if (savedScrollPosition !== null) {
            window.scrollTo(0, parseInt(savedScrollPosition, 10));
        }
    }, []);

    const handleSlideChange = (swiper) => {
        localStorage.setItem('currentSlide', swiper.activeIndex);
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (typeof window !== 'undefined') {
                const scrollPosition = window.scrollY || window.pageYOffset;
                localStorage.setItem('scrollPosition', scrollPosition.toString());
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);


    return (
        <header className={`${Styles.header}`} data-testid="header">
            <div className="game-container d-flex" style={{ height: '100%' }}>
                <div className={Styles["header-container"]} ref={swiperContainerRef}>
                    <Swiper
                        initialSlide={initialSlide}
                        onSlideChange={handleSlideChange}
                        slidesPerView="auto"
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation]}
                        className={Styles["swiper"]}
                    >
                        {lobbyGamesIds?.map((gameId) => {
                            const swipeItemId = `SwiperSlide-${gameId}`;
                            return <SwiperSlide style={{ width: 'auto', display: 'flex', justifyContent: 'center' }} className={Styles["swiper-slide"]} key={swipeItemId} id={swipeItemId}>
                                <NavBarGameName gameId={gameId} />
                            </SwiperSlide>;
                        })}

                    </Swiper>
                    <div className={Styles["header-bottom"]}></div>
                </div>
            </div>
            <Settings isLandscapeMode={true} />
        </header>
    );
};


export default Header;
