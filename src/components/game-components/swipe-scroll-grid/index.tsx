import React, { useEffect, useRef, useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { ScrollContainer } from './swipe-scroll-grid-styles';


interface SwipeScrollGridProps {
    children: React.ReactNode;
    scrollRightSignal?: boolean;
    initialScrollRight?: boolean;
}

const SwipeScrollGrid: React.FC<SwipeScrollGridProps> = ({ children,
    initialScrollRight = true,
    scrollRightSignal, }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);

    const bind = useDrag(
        ({ movement: [mx], memo = containerRef.current.scrollLeft, first, last, direction: [dx] }) => {
            if (first) {
                setDragging(true);
            }

            if (containerRef.current) {
                containerRef.current.scrollLeft = memo - mx;
            }

            if (last) {
                setDragging(false);

                const scrollWidth = containerRef.current.scrollWidth;
                const clientWidth = containerRef.current.clientWidth;

                if (dx > 0) {
                    containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else if (dx < 0) {
                    containerRef.current.scrollTo({ left: scrollWidth - clientWidth, behavior: 'smooth' });
                }
            }

            return memo;
        }
    ) as unknown as (...args: any[]) => ReactDOMAttributes;

    useEffect(() => {
        if (initialScrollRight && containerRef.current) {
            containerRef.current.scrollTo({ left: containerRef.current.scrollWidth, behavior: 'smooth' });
        }
    }, [initialScrollRight]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({ left: containerRef.current.scrollWidth, behavior: 'smooth' });
        }
    }, [scrollRightSignal]);

    return (
        <ScrollContainer ref={containerRef} {...bind()} $dragging={dragging}>
            {children}
        </ScrollContainer>
    );
};

export default SwipeScrollGrid;
