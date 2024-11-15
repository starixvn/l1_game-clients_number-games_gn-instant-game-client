import React, { useEffect, useRef, useState } from 'react';
import { useGesture, useDrag } from '@use-gesture/react';
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';

function SwipeScrollGrid({ children }) {
    const containerRef = useRef<HTMLDivElement>(null);
    // const velocityRef = useRef({ x: 0, y: 0 });
    // const decelerationRef = useRef<number | null>(null);

    // const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });

    // const [swipeXXX, setSwipeXXX] = React.useState(0);

    // const [position, setPosition] = useState({ x: 0, y: 0 });
    // const [dragging, setDragging] = useState(false);

    // const scrollRef = useRef(null);
    const [dragging, setDragging] = useState(false);


    const bind = useDrag(
        ({ movement: [mx], memo = containerRef.current.scrollLeft, first, last, direction: [dx] }) => {
            // onDragStart: Triggered when the drag starts
            if (first) {
                setDragging(true);
                console.log('Drag started');
            }

            // onDrag: Update the scroll position
            if (containerRef.current) {
                containerRef.current.scrollLeft = memo - mx;
            }

            // onDragEnd: Scroll to end or start based on drag direction
            if (last) {
                setDragging(false);
                console.log('Drag ended');

                const scrollWidth = containerRef.current.scrollWidth;
                const clientWidth = containerRef.current.clientWidth;

                if (dx > 0) {
                    // If dragging left, scroll to the start
                    containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else if (dx < 0) {
                    // If dragging right, scroll to the end
                    containerRef.current.scrollTo({ left: scrollWidth - clientWidth, behavior: 'smooth' });
                }
            }

            return memo; // Return the memoized scroll position for continuity
        }
    ) as unknown as (...args: any[]) => ReactDOMAttributes;;
    // const bind = useDrag(
    //     ({ movement: [mx], memo = containerRef.current.scrollLeft, first, last }) => {
    //         // onDragStart: Triggered when the drag starts
    //         if (first) {
    //             setDragging(true);
    //             console.log('Drag started');
    //         }

    //         // onDrag: Update the scroll position
    //         if (containerRef.current) {
    //             containerRef.current.scrollLeft = memo - mx;
    //         }

    //         // onDragEnd: Triggered when the drag ends
    //         if (last) {
    //             setDragging(false);
    //             console.log('Drag ended');
    //         }

    //         return memo; // Return the memoized scroll position for continuity
    //     }
    // ) as unknown as (...args: any[]) => ReactDOMAttributes;


    // const applyDeceleration = () => {
    //     if (!containerRef.current) return;

    //     let { x, y } = velocityRef.current;

    //     // Deceleration factor for smoothness
    //     const decelerationFactor = 0.95;
    //     x *= decelerationFactor;
    //     y *= decelerationFactor;

    //     // Apply the decelerating scroll to the container
    //     containerRef.current.scrollLeft += x;
    //     containerRef.current.scrollTop += y;

    //     // Update velocity
    //     velocityRef.current = { x, y };

    //     // Stop the deceleration loop if speed is low enough
    //     if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1) {
    //         decelerationRef.current = requestAnimationFrame(applyDeceleration);
    //     } else {
    //         cancelAnimationFrame(decelerationRef.current);
    //     }
    // };

    // const bind = useDrag(
    //     ({ swipe: [swipeX], movement: [mx, my], memo = position, active, first, last }) => {
    //         // position will either be -1, 0 or 1
    //         console.log({ swipeX })
    //         setSwipeXXX(swipeX);
    //         // setPosition((p) => Math.min(Math.max(-1, p + swipeX), 1))
    //         setPosition({ x: mx + memo.x, y: my + memo.y });
    //         // onDragStart: Triggered when the drag starts
    //         if (first) {
    //             setDragging(true);
    //             console.log('Drag started');
    //         }

    //         // onDrag: Triggered during dragging
    //         setPosition({ x: mx, y: my });
    //         console.log('Dragging', mx, my);

    //         // onDragEnd: Triggered when the drag ends
    //         if (last) {
    //             setDragging(false);
    //             console.log(`onDragEnd`);
    //             decelerationRef.current = requestAnimationFrame(applyDeceleration);
    //         }

    //     }) as unknown as (...args: any[]) => ReactDOMAttributes;


    // useGesture(
    //     {
    //         onDragStart: () => {
    //             console.log(`onDragStart`);
    //             setCurrentPosition(
    //                 {
    //                     x: containerRef.current.scrollLeft,
    //                     y: containerRef.current.scrollTop
    //                 }
    //             )
    //             console.log({
    //                 onDragStartX: containerRef.current.scrollLeft,
    //                 onDragStartY: containerRef.current.scrollTop
    //             });
    //         },
    //         onDrag: ({
    //             movement: [x, y],
    //             memo = {
    //                 startX: 0,
    //                 startY: 0,
    //             },
    //             velocity: [vx, vy]
    //         }) => {
    //             console.log(memo)
    //             // if (swipeXXX === 0) {
    //             //     return;
    //             // }
    //             if (containerRef.current) {
    //                 containerRef.current.scrollLeft = memo.startX - x;
    //                 containerRef.current.scrollTop = memo.startY - y;

    //                 // Update the velocity during drag
    //                 console.log({ vx, vy })
    //                 velocityRef.current = { x: vx * 30, y: vy * 30 };
    //                 console.log({ x: vx * 30, y: vy * 30 })
    //             }

    //             return {
    //                 startX: containerRef.current.scrollLeft,
    //                 startY: containerRef.current.scrollTop,
    //             };
    //         },
    //         // onDrag: ({ movement: [x, y], memo = { startX: 0, startY: 0 }, velocity: [vx, vy] }) => {
    //         //     console.log({ startX: 0, startY: 0 })
    //         //     if (containerRef.current) {
    //         //         containerRef.current.scrollLeft = memo.startX - x;
    //         //         containerRef.current.scrollTop = memo.startY - y;

    //         //         // Update the velocity during drag
    //         //         velocityRef.current = { x: vx * 30, y: vy * 30 };
    //         //         console.log({ x: vx * 30, y: vy * 30 })
    //         //     }

    //         //     console.log({
    //         //         startX: containerRef.current.scrollLeft,
    //         //         startY: containerRef.current.scrollTop,
    //         //     })
    //         //     return {
    //         //         startX: containerRef.current.scrollLeft,
    //         //         startY: containerRef.current.scrollTop,
    //         //     };
    //         // },
    //         onDragEnd: () => {
    //             // Apply deceleration effect on drag end
    //             console.log(`onDragEnd`);
    //             decelerationRef.current = requestAnimationFrame(applyDeceleration);
    //         },
    //     },
    //     {
    //         target: containerRef,
    //         eventOptions: { passive: false },
    //         threshold: 50,
    //         tapsThreshold: 10,
    //         filterTaps: true,
    //         swipe: { distance: 300, velocity: [0.5, 0.5] },
    //         pointer: {
    //             // lock: true
    //         }
    //     }
    // );

    // useEffect(() => {
    //     if (containerRef.current) {
    //         containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    //     }
    // }, []);


    return (
        <div
            ref={containerRef}
            {...bind()}
            style={{
                overflow: 'auto',
                cursor: dragging ? 'grabbing' : 'grab',
                // width: '100%',
                // height: '400px',
                display: 'grid',
                // gridTemplateColumns: 'repeat(4, 1fr)', // Adjust as needed
                // gridGap: '10px',
                userSelect: 'none',
                touchAction: 'none', // Prevents native scrolling on mobile
            }}
        >
            {children}
        </div>
    );
}

export default SwipeScrollGrid;

