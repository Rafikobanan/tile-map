import React, { useLayoutEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useTooltip } from '../tooltipContext';

const TileMapGrid = ({ stroke, data, cellSize, columnKey, rowKey }) => {
    const tileMapGrid = useRef(null);
    const { setTooltipData, setElEvent } = useTooltip();

    useLayoutEffect(() => {
        const gridMapNode = tileMapGrid.current;

        d3.select(gridMapNode)
            .selectAll('.state')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (data) => data[columnKey] * cellSize)
            .attr('y', (data) => data[rowKey] * cellSize)
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('class', 'state')
            .style('fill', 'transparent')
            .style('stroke', stroke)
            .on('mousemove', (e, data) => {
                setElEvent(e);
                setTooltipData(data);
            })
            .on('mouseout', (d) => {
                setTooltipData(null);
            });

        return () => gridMapNode.innerHTML = '';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, cellSize, columnKey, rowKey, stroke]);

    return <g ref={tileMapGrid}></g>;
};

export default TileMapGrid;
