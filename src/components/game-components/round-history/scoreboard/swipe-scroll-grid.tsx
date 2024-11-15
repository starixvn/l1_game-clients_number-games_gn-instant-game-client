import React, { useEffect, useRef, useState } from 'react';
import { useDrag, useWheel } from '@use-gesture/react';
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';

const SwipeScrollGrid = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);

    const bind = useDrag(
        ({ movement: [mx], memo = containerRef.current.scrollLeft, first, last, direction: [dx] }) => {
            if (first) {
                setDragging(true);
                console.log('Drag started');
            }

            if (containerRef.current) {
                containerRef.current.scrollLeft = memo - mx;
                console.log('Dragging');
            }

            if (last) {
                setDragging(false);
                console.log('Drag ended');

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

    const bindWheel = useWheel(({ delta: [, dy] }) => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += dy;
        }
    }) as unknown as (...args: any[]) => ReactDOMAttributes;

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollLeft = containerRef.current.scrollWidth;
        }
    }, []);

    return (
        <div
            ref={containerRef}
            {...bind()}
            {...bindWheel()}
            style={{
                overflowX: 'auto',
                overflowY: 'hidden',
                height: '100%',
                cursor: dragging ? 'grabbing' : 'grab/pointer',
                display: 'grid',
                userSelect: 'none',
                touchAction: 'none',
            }}
        >
            {children}
        </div>
    );
}

export default SwipeScrollGrid;

