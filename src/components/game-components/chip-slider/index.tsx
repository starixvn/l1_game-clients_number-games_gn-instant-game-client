import React, { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import {
    PlayerContextModel,
    SystemEventActionType,
    usePlayerContext,
    useSettingContext,
    useSystemContext,
    useSystemDispatch,
} from "../../../_shared/react-contexts";
import { useScreenOrientation, useSelectChipSound } from "../../../_shared/react-hooks";
import { GameConfigs, UserStakeLevel } from "../../game-base/type";
import { Chip } from "./chip";
import Styles from "./chip-slider.module.scss";

const SlidingTimeInMillisecond = 100;
const slideToShowConstant = {
    portrait: 3,
    landscape: 7
}
let isSwipe = true;

export const ChipSlider: React.FC<{ gameConfigs: GameConfigs; userStakeLevel: UserStakeLevel }> = ({ gameConfigs, userStakeLevel }) => {
    const isPortrait = useScreenOrientation();
    const systemContext = useSystemContext();
    const dispatch = useSystemDispatch();
    const { authorizeInfo, enableQuickBet } = usePlayerContext() as PlayerContextModel;
    const enabledQuickBet = authorizeInfo?.user?.settings.quickBet || enableQuickBet;
    const { selectedChip } = systemContext;
    const [enabledPrevBtn, setEnabledPrevBtn] = useState(false);
    const [enabledNextBtn, setEnabledNextBtn] = useState(true);
    const [slidesToShow, setSlidesToShow] = useState(slideToShowConstant.portrait);
    const settingContext = useSettingContext();
    const chipSettings = settingContext.chipSettings;
    const [isSliding, setIsSliding] = useState(false);

    const [slickListStyle, setSlickListStyle] = useState({
        paddingLeft: 0,
        paddingRight: 0,
    });

    let sliderRef = null;
    const playClickChip = useSelectChipSound();

    const chipValues = useMemo(() => {
        if (gameConfigs && userStakeLevel) {
            const maxBet = Math.min(userStakeLevel.maxBet, gameConfigs.maxBet);
            const minBet = Math.max(userStakeLevel.minBet, gameConfigs.minBet);
            return gameConfigs.chips?.map((chip) => +chip).filter((value) => value >= minBet && value <= maxBet) || [];
        }
        return [];
    }, [gameConfigs?.maxBet, gameConfigs?.minBet, gameConfigs?.chips, userStakeLevel]);

    useEffect(() => {
        const checkOrientation = () => {
            const { portrait, landscape } = slideToShowConstant;
            setSlidesToShow(isPortrait ? portrait : landscape);

        };

        checkOrientation();

        window.addEventListener("resize", checkOrientation);

        if (sliderRef) {
            isSwipe = false;
            const chipIndex = chipValues.indexOf(selectedChip);
            sliderRef.slickGoTo(chipIndex);
            updateArrowsByChipValue(selectedChip);
        }

        return () => window.removeEventListener("resize", checkOrientation);

    }, []);

    const onClickChip = (chipValue: number) => {
        const chipIndex = chipValues.indexOf(chipValue);
        const currentSlide = sliderRef.innerSlider.state.currentSlide;

        if (chipIndex + 1 - slidesToShow >= currentSlide) {
            disableSelectChipWhenSliding();
            isSwipe = false;
            sliderRef.slickGoTo(chipIndex + 2 - slidesToShow);
        }

        if (chipIndex - 1 <= currentSlide) {
            disableSelectChipWhenSliding();
            isSwipe = false;
            sliderRef.slickGoTo(chipIndex - 1);
        }

        handleSelectChip(chipValue);
    };

    const handleSelectChip = (chipValue: number) => {
        if (selectedChip !== chipValue) {
            dispatch({
                type: SystemEventActionType.SELECT_CHIP,
                payload: {
                    selectedChip: chipValue,
                },
            });
            playClickChip();
        }
    };

    const updateArrowsByChipValue = (chipValue: number) => {
        const chipIndex = chipValues.indexOf(chipValue);

        chipIndex <= 0 ? setEnabledPrevBtn(false) : setEnabledPrevBtn(true);
        chipIndex === chipValues.length - 1 ? setEnabledNextBtn(false) : setEnabledNextBtn(true);
    };

    const disableSelectChipWhenSliding = () => {
        setIsSliding(true);

        const slidingTimeOut = setTimeout(() => {
            setIsSliding(false);
            clearTimeout(slidingTimeOut);
        }, SlidingTimeInMillisecond);
    };

    const onClickNext = () => {
        if (enabledNextBtn && !isSliding) {
            const chipIndex = chipValues.indexOf(selectedChip);
            const newSelectedChip = chipValues[chipIndex + 1];

            isSwipe = false;
            sliderRef.slickGoTo(chipIndex + 3 - slidesToShow);
            handleSelectChip(newSelectedChip);
            disableSelectChipWhenSliding();
        }
    };

    const onClickPrev = () => {
        if (enabledPrevBtn && !isSliding) {
            const chipIndex = chipValues.indexOf(selectedChip);
            const newSelectedChip = chipValues[chipIndex - 1];

            isSwipe = false;
            sliderRef.slickGoTo(chipIndex - 3);
            handleSelectChip(newSelectedChip);
            disableSelectChipWhenSliding();
        }
    };

    useEffect(() => {
        const chip = chipValues.find((chip) => chip === selectedChip) || chipValues?.[0];
        chip > 0 && onClickChip(chip);
        chipValues && updateArrowsByChipValue(selectedChip);
    }, [chipValues, selectedChip]);

    const findChipSetting = (value) => {
        return chipSettings?.find((c) => c.value === value);
    };

    const updateSlickListStyle = (index: number) => {
        if (index === 0) {
            setSlickListStyle({ paddingLeft: 0, paddingRight: 1 });

        } else if (index === chipValues.length - 1) {
            setSlickListStyle({ paddingLeft: 1, paddingRight: 0 });
        }
        else {
            setSlickListStyle({ paddingLeft: 0, paddingRight: 0 });
        }
    }

    const SliderSetting = {
        speed: SlidingTimeInMillisecond,
        infinite: false,
        adaptiveHeight: true,
        swipeToSlide: true,
        slidesToShow,
        arrows: false,
        variableWidth: true,
        draggable: true,
        onSwipe: () => {
            isSwipe = true;
        },
        beforeChange: (oldIndex: number, newIndex: number) => {
            if (isSwipe) {
                oldIndex > newIndex && handleSelectChip(chipValues[newIndex + slidesToShow - 1]);
                oldIndex < newIndex && handleSelectChip(chipValues[newIndex]);
            }

            updateSlickListStyle(newIndex);
        },
    };

    return (
        <div>
            <span
                id="icon-chip-slider-pre"
                className={`${Styles["icon-prev"]} ${!enabledPrevBtn && Styles["disabled"]} ${enabledQuickBet ? Styles["quick-bet"] : ""}`}
                onClick={onClickPrev}
            ></span>
            {chipValues?.length > 0 && (
                <Slider
                    ref={(c) => {
                        sliderRef = c;
                    }}
                    {...SliderSetting}
                >
                    {chipValues.map((value) => (
                        <Chip
                            key={+value}
                            value={+value}
                            text={findChipSetting(value)?.text}
                            image={findChipSetting(value)?.color}
                            onClickChip={onClickChip}
                        />
                    ))}
                </Slider>
            )}
            {
                <style>
                    {`.slick-list { padding: 0.2rem ${slickListStyle.paddingLeft}rem 0 ${slickListStyle.paddingRight}rem;}`}
                </style>
            }
            <span
                id="icon-chip-slider-next"
                className={`${Styles["icon-next"]} ${!enabledNextBtn && Styles["disabled"]} ${enabledQuickBet ? Styles["quick-bet"] : ""}`}
                onClick={onClickNext}
            ></span>
        </div>
    );
};
