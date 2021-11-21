import React, { useLayoutEffect, useRef } from 'react';
import * as d3 from 'd3';
import styles from './styles.module.scss';
import { TooltipProvider } from './tooltipContext';

const TileMap = ({ children, data, columns, rows, cellSize = 50, columnKey, rowKey, ...rest }) => {
    const gridRef = useRef(null);

    useLayoutEffect(() => {
        const gridNode = gridRef.current;

        const gridData = [];
        let x = 1;
        let y = 1;

        for (let row = 0; row < rows; row++) {
            gridData.push([]);

            for (let col = 0; col < columns; col++) {
                gridData[row].push({
                    x,
                    y
                })

                x += cellSize;
            }

            x = 1;
            y += cellSize;
        }

        const grid = d3.select(gridNode);
        const row = grid.selectAll(styles.row).data(gridData).enter().append('g').attr('class', styles.row);

        row.selectAll('.cell')
            .data((data) => data)
            .enter()
            .append('rect')
            .attr('class', 'cell')
            .attr('x', (data) => data.x)
            .attr('y', (data) => data.y)
            .attr('width', cellSize)
            .attr('height', cellSize)
            .style('fill', 'transparent');

        return () => gridNode.innerHTML = '';
    }, [cellSize, columns, rows]);

    return <svg viewBox={`0 0 ${columns * cellSize} ${rows * cellSize}`} {...rest}>
        <TooltipProvider>
            <g ref={gridRef}></g>
            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;

                const defaultProps = { cellSize, data, columnKey, rowKey };

                return React.cloneElement(child, defaultProps);
            })}
        </TooltipProvider>
    </svg>
};

export default TileMap;
