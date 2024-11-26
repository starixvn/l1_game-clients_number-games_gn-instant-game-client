import React, { useEffect, useMemo, useRef, useState } from "react";
import Slider from "react-slick";
import {
    SystemEventActionType,
    useSettingContext,
    useSystemContext,
    useSystemDispatch,
} from "../../../_shared/react-contexts";
import { useScreenOrientation, useSelectChipSound } from "../../../_shared/react-hooks";
import { GameConfigs, UserStakeLevel } from "../../game-base/type";
import { Chip } from "./chip";
import Styles from "./chip-slider.module.scss";
import { localStorageKeys, StorageHelper } from "../../../_shared/helpers";

const SlidingTimeInMillisecond = 300;
const slideToShowConstant = {
    portrait: 4,
    landscape: 7
}

export const ChipSlider: React.FC<{ gameConfigs: GameConfigs; userStakeLevel: UserStakeLevel }> = ({ gameConfigs, userStakeLevel }) => {
    const isPortrait = useScreenOrientation();
    const systemContext = useSystemContext();
    const dispatch = useSystemDispatch();
    const { selectedChip } = systemContext;
    const [enabledPrevBtn, setEnabledPrevBtn] = useState(false);
    const [enabledNextBtn, setEnabledNextBtn] = useState(true);
    const [slidesToShow, setSlidesToShow] = useState(slideToShowConstant.portrait);
    const settingContext = useSettingContext();
    const chipSettings = settingContext.chipSettings;
    const [isFirstLoad, setIsFirstLoad] = useState(false);
    const [scrollingState, setScrollingState] = useState({
        isScrolling: false,
        direction: ""
    });

    const [currentSlide, setCurrentSlide] = useState(0);

    let sliderRef = useRef<any>(null);
    let sliderWrapperRef = useRef<any>(null);

    const [slickListStyle, setSlickListStyle] = useState({
        paddingLeft: 0,
        paddingRight: 0
    });

    const playClickChip = useSelectChipSound();

    const resetScrollState = () => {
        setScrollingState({
            isScrolling: false,
            direction: ""
        });
    }

    const chipValues = useMemo(() => {
        if (gameConfigs && userStakeLevel) {
            const maxBet = Math.min(userStakeLevel.maxBet, gameConfigs.maxBet);
            const minBet = Math.max(userStakeLevel.minBet, gameConfigs.minBet);
            return gameConfigs.chips?.map(Number).filter((value) => value >= minBet && value <= maxBet) || [];
        }
        return [];
    }, [gameConfigs, userStakeLevel]);

    useEffect(() => {
        const checkOrientation = () => {
            const { portrait, landscape } = slideToShowConstant;
            setSlidesToShow(isPortrait ? portrait : landscape);
            !isFirstLoad && onClickChip(chipValues[selectedChip]);
        };

        setIsFirstLoad(true);
        checkOrientation();
        window.addEventListener("resize", checkOrientation);

        return () => {
            StorageHelper.set(localStorageKeys.isSleepMode, document.hidden);
            window.removeEventListener("resize", checkOrientation);
        };
    }, [isPortrait]);

    const onClickChip = (chipValue: number) => {
        const chipIndex = chipValues.indexOf(chipValue);

        const currentSlide = sliderRef.current?.innerSlider.state.currentSlide;

        if (chipIndex + 1 - slidesToShow >= currentSlide) {
            sliderRef.current?.slickGoTo(chipIndex + 2 - slidesToShow);
        }

        if (chipIndex - 1 <= currentSlide) {
            sliderRef.current?.slickGoTo(chipIndex - 1);
        }

        handleSelectChip(chipValue);
        updateSlickListStyle(chipIndex);

        if (isFirstLoad) {
            setIsFirstLoad(false);
            return;
        }

        handleScrollChips();
    };

    const handleSelectChip = (chipValue: number) => {
        if (selectedChip !== chipValue && !StorageHelper.get<boolean>(`${localStorageKeys.isSleepMode}`)) {
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

        setEnabledPrevBtn(chipIndex > 0);
        setEnabledNextBtn(chipIndex !== chipValues.length - 1);
    };

    useEffect(() => {
        const chip = chipValues.find((chip) => chip === selectedChip) || chipValues?.[0];
        chip > 0 && onClickChip(chip);

        setTimeout(() => {
            chipValues && updateArrowsByChipValue(selectedChip);
        }, 100);
    }, [chipValues, selectedChip]);

    const findChipSetting = (value) => {
        return chipSettings?.find((c) => c.value === value);
    };

    const updateSlickListStyle = (chipIndex: number) => {
        setSlickListStyle(
            chipIndex === 0
                ? { paddingLeft: 0, paddingRight: 1 }
                : chipIndex === chipValues.length - 1
                    ? { paddingLeft: 2, paddingRight: 0 }
                    : { paddingLeft: 0, paddingRight: 0 }
        );
    };

    const setStateWhenClickPrevOrNext = (isNextButton: boolean) => {
        const chipIndex = chipValues.indexOf(selectedChip);
        const jumpIndex = isNextButton ? 1 : -1;
        onClickChip(chipValues[chipIndex + jumpIndex]);

        resetScrollState();
        setEnabledNextBtn(!isNextButton);
        setEnabledPrevBtn(isNextButton);
    }

    const PrevArrow = () => (
        <span
            id="icon-chip-slider-pre"
            className={`${Styles["icon-prev"]} ${!enabledPrevBtn && Styles["disabled"]}`}
            onClick={() => enabledPrevBtn && setStateWhenClickPrevOrNext(false)}
        ></span>
    );

    const NextArrow = () => (
        <span
            id="icon-chip-slider-next"
            className={`${Styles["icon-next"]} ${!enabledNextBtn && Styles["disabled"]}`}
            onClick={() => enabledNextBtn && setStateWhenClickPrevOrNext(true)}
        ></span>
    );

    const handleScrollChips = () => {
        if (isVisibleCurrentSelectedChip()) return;
        const activeElements = sliderWrapperRef.current?.querySelectorAll(".slick-active") || [];

        const slickElmIndex = scrollingState.direction === "right" ? 0 : activeElements.length - 1;

        const parentIndex = parseInt(activeElements[slickElmIndex]?.getAttribute("data-index") || "0", 10);
        sliderRef.current?.slickGoTo(parentIndex);
        handleSelectChip(chipValues[parentIndex]);
        resetScrollState();
    };

    const isVisibleCurrentSelectedChip = () => {
        const activeElements = Array.from((sliderWrapperRef as React.RefObject<HTMLDivElement>).current?.querySelectorAll(".slick-active") || []);
        const activeSlidesIndices = activeElements.map((element) => element.getAttribute("data-index"));
        return activeSlidesIndices.includes(chipValues.indexOf(selectedChip).toString());
    }

    const handleSleepMode = () => {
        if (sliderRef.current) {
            sliderRef.current?.slickGoTo(currentSlide);
            const chipIndex = chipValues.indexOf(selectedChip);
            handleSelectChip(chipValues[chipIndex]);

            setTimeout(() => {
                handleScrollChips();
                StorageHelper.set(localStorageKeys.isSleepMode, false);
            }, 500);
        }
    }

    const SliderSetting = {
        speed: SlidingTimeInMillisecond,
        infinite: false,
        adaptiveHeight: true,
        slidesToShow,
        arrows: true,
        variableWidth: true,
        slidesToScroll: slidesToShow,
        touchThreshold: 10,
        swipeEvent: (direction: string) => {
            setScrollingState({
                isScrolling: true,
                direction
            })
        },
        afterChange: (currentSlide: number) => {
            setCurrentSlide(currentSlide);
            if (StorageHelper.get<boolean>(localStorageKeys.isSleepMode)) {
                return handleSleepMode();
            }

            scrollingState.isScrolling && handleScrollChips();
        },
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <div ref={sliderWrapperRef}>
            {chipValues?.length > 0 && (
                <Slider ref={sliderRef} {...SliderSetting} >
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
                    {`.slick-list { padding: 0.2rem ${slickListStyle.paddingLeft}rem 0 ${slickListStyle.paddingRight}rem; margin-left: 0; }`}
                </style>
            }
        </div>
    );
};
