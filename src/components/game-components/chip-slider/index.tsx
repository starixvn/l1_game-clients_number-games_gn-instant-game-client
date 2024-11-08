import React, { useEffect, useMemo, useRef, useState } from "react";
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
    const [isSliding, setIsSliding] = useState(false);
    let sliderRef = useRef<any>(null);
    let sliderWrapperRef = useRef<any>(null);

    const [slickListStyle, setSlickListStyle] = useState({
        paddingLeft: 0,
        paddingRight: 0
    });

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
            const chipIndex = chipValues.indexOf(selectedChip);
            sliderRef.current?.slickGoTo(chipIndex);
            updateArrowsByChipValue(selectedChip);
        }

        return () => {
            StorageHelper.set(localStorageKeys.isSleepMode, document.hidden);;
            window.removeEventListener("resize", checkOrientation);
        }

    }, []);

    const onClickChip = (chipValue: number) => {
        console.log(`onClickChip: ` + chipValue);
        const chipIndex = chipValues.indexOf(chipValue);

        const currentSlide = sliderRef.current?.innerSlider.state.currentSlide;

        if (chipIndex + 1 - slidesToShow >= currentSlide) {
            disableSelectChipWhenSliding();
            sliderRef.current?.slickGoTo(chipIndex + 2 - slidesToShow);
        }

        if (chipIndex - 1 <= currentSlide) {
            disableSelectChipWhenSliding();
            sliderRef.current?.slickGoTo(chipIndex - 1);
        }

        handleSelectChip(chipValue);
        updateSlickListStyle(chipIndex);
    };

    const handleSelectChip = (chipValue: number) => {
        console.log({ chipValue, selectedChip });
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


    useEffect(() => {
        // console.log(`change chipValues`);
        // console.log({ selectedChip });
        // const chip = chipValues.find((chip) => chip === selectedChip) || chipValues?.[0];
        // chip > 0 && onClickChip(chip);
        // chipValues && updateArrowsByChipValue(selectedChip);
    }, [chipValues]);

    useEffect(() => {
        console.log(`change selectedChip`);
        console.log({ selectedChip });
        const chip = chipValues.find((chip) => chip === selectedChip) || chipValues?.[0];
        chip > 0 && onClickChip(chip);
        chipValues && updateArrowsByChipValue(selectedChip);
    }, [selectedChip]);

    const findChipSetting = (value) => {
        return chipSettings?.find((c) => c.value === value);
    };

    const updateSlickListStyle = (chipIndex: number) => {
        if (chipIndex === 0) {
            setSlickListStyle({ paddingLeft: 0, paddingRight: 1 });

        } else if (chipIndex === chipValues.length - 1) {
            setSlickListStyle({ paddingLeft: 2, paddingRight: 0 });
        }
        else {
            setSlickListStyle({ paddingLeft: 0, paddingRight: 0 });
        }
    }

    const SamplePrevArrow = (props) => {
        const { className, onClick } = props;
        const onClickPrev = () => {
            console.log({ props });
            if (enabledPrevBtn && !isSliding) {
                const chipIndex = chipValues.indexOf(selectedChip);
                const newSelectedChip = chipValues[chipIndex - 1];

                sliderRef.current?.slickGoTo(chipIndex - 1);
                handleSelectChip(newSelectedChip);
                disableSelectChipWhenSliding();
            }
        };

        return (
            <span
                id="icon-chip-slider-pre"
                className={`${Styles["icon-prev"]} ${!enabledPrevBtn && Styles["disabled"]}`}
                onClick={onClickPrev}
            ></span>
        );
    }

    const SampleNextArrow = (props) => {
        const { className, onClick } = props;
        const onClickNext = () => {
            console.log({ props });
            if (enabledNextBtn && !isSliding) {
                const chipIndex = chipValues.indexOf(selectedChip);
                const newSelectedChip = chipValues[chipIndex + 1];

                sliderRef.current?.slickGoTo(chipIndex + 1);
                handleSelectChip(newSelectedChip);
                disableSelectChipWhenSliding();
            }
        };

        return (
            <span
                id="icon-chip-slider-next"
                className={`${Styles["icon-next"]} ${!enabledNextBtn && Styles["disabled"]} : ""}`}
                onClick={onClickNext}
            ></span>
        );
    }

    const getSlickActiveParentDataIndexes = (sliderWrapperRef: React.RefObject<HTMLDivElement>): (string | null)[] => {
        const activeElements = sliderWrapperRef.current?.querySelectorAll(".slick-active");

        const dataIndexes = Array.from(activeElements || []).map((element) => {
            return element?.getAttribute("data-index") || null;
        });
        console.log({ dataIndexes })
        return dataIndexes;
    };
    const updateSelectedChipBySlick = () => {

        const activeElements = sliderWrapperRef.current?.querySelectorAll(".slick-active");

        const dataIndexes = getSlickActiveParentDataIndexes(sliderWrapperRef);

        const parentIndex = activeElements?.[activeElements.length - 1].getAttribute("data-index");

        const chipIndex = chipValues.indexOf(selectedChip);

        if (dataIndexes.includes(chipIndex.toString())) {
            return;
        }
        sliderRef.current?.slickGoTo(parentIndex);

        handleSelectChip(chipValues[parentIndex]);

    }

    const handleSleepMode = () => {
        const chipIndex = chipValues.indexOf(selectedChip);
        const currentSlideStore = StorageHelper.get<number>(`${localStorageKeys.currentChipSlide}`);
        console.log("sleep mode: ");
        console.log({ selectedChip, chipIndex, currentSlideStore });
        console.log(`------------`);
        sliderRef.current?.slickGoTo(currentSlideStore);

        StorageHelper.set(localStorageKeys.isSleepMode, false);
    }

    const SliderSetting = {
        speed: SlidingTimeInMillisecond,
        infinite: false,
        adaptiveHeight: true,
        // swipeToSlide: true,
        slidesToShow,
        arrows: true,
        variableWidth: true,
        // touchMove: !isPortrait,
        // slidesToScroll: 1,
        slidesToScroll: isPortrait ? 5 : 5,
        // draggable: true,
        onSwipe: (direction) => {
        },
        beforeChange: (currentSlide: number, nextSlide: number) => {
            console.log({ currentSlide, nextSlide });

        },
        afterChange: (currentSlide: number) => {
            const isSleepMode = StorageHelper.get<boolean>(`${localStorageKeys.isSleepMode}`);
            if (isSleepMode) {
                return handleSleepMode();
            }

            StorageHelper.set(localStorageKeys.currentChipSlide, currentSlide);
            console.log("afterChange currentSlide : " + currentSlide);
            updateSelectedChipBySlick();
        },

        onInit: () => {
            // console.log("onInit");
        },
        onReInit: () => {
            // console.log("onReInit");
        },
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
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
