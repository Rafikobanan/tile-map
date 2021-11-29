import React from 'react';
import { TooltipProvider } from './tooltipContext';

const TileMap = ({ children, data, columns, rows, cellSize = 50, columnKey, rowKey, ...rest }) => (
    <svg viewBox={`0 0 ${columns * cellSize} ${rows * cellSize}`} {...rest}>
        <TooltipProvider>
            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;

                const defaultProps = { cellSize, data, columnKey, rowKey };

                return React.cloneElement(child, defaultProps);
            })}
        </TooltipProvider>
    </svg>
);

export default TileMap;
