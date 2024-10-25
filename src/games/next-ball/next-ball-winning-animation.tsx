import { buildVersion } from "../../_shared/constants";
import { useScreenOrientation } from "../../_shared/react-hooks";
import { isHighLightWinningResult } from "../../_shared/react-hooks/use-high-light";
import { RoundState } from "../../components/game-base/type";
import { Spritesheet } from "../../components/game-components/sprites-sheet";
import Styles from "./next-ball.module.scss";

type Props = {
    choice: string;
    className?: string;
    roundState: RoundState;
    settlementResult: any;
    showResultInfo: any;
};

const NextBallWinningAnimation: React.FC<Props> = ({ choice, roundState, settlementResult, showResultInfo }) => {
    const winningHighLightResult = isHighLightWinningResult;
    const isPortrait = useScreenOrientation();
    return (
        winningHighLightResult({ betChoice: choice, roundState, settlementResult, showResultInfo }) && 
        (
            <div className="d-grid">
                <Spritesheet
                    className={`${Styles[`winning-light-anim`]} ${Styles[`anim-${choice}`]}`}
                    image={`/static/images/next-ball/${isPortrait ? "portrait" : "landscape"}/highlight-winning.webp?v=${buildVersion}`}
                    widthFrame={isPortrait ? 217 : 246}
                    isResponsive
                    heightFrame={isPortrait ? 224 : 236}
                    steps={6}
                    autoplay={true}
                    loop={true}
                    fps={25}
                    startAt={0}
                    endAt={29}
                />
                <div className={`highlight-winning-bg-anim ${Styles[`highlight-winning-bg-${choice}`]}`}></div>
            </div>
        )
    );
};

export default NextBallWinningAnimation;
