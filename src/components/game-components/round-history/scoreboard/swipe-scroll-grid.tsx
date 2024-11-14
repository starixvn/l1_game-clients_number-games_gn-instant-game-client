import React, { useRef } from 'react';
import { useGesture } from '@use-gesture/react';

function SwipeScrollGrid({ children }) {
    const containerRef = useRef(null);

    useGesture(
        {
            onDrag: ({ movement: [x, y], memo = { startX: 0, startY: 0 } }) => {
                if (containerRef.current) {
                    containerRef.current.scrollLeft = memo.startX - x;
                    containerRef.current.scrollTop = memo.startY - y;
                }
                return {
                    startX: containerRef.current.scrollLeft,
                    startY: containerRef.current.scrollTop,
                };
            },
        },
        {
            target: containerRef,
            eventOptions: { passive: false }, // Allows us to prevent default touch behavior
        }
    );

    return (
        <div
            ref={containerRef}
            style={{
                overflow: 'auto',
                cursor: 'grab',
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
