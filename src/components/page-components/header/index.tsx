
import Styles from "./header.module.scss";
import { NavBarGameName } from "./header-title";

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
