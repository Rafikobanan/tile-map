import React, { useLayoutEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useTooltip } from '../tooltipContext';
import styles from './styles.module.scss';

const TileMapGrid = ({ stroke, data, cellSize, columnKey, rowKey }) => {
    const tileMapGrid = useRef(null);
    const { setTooltipData, setElEvent } = useTooltip();

    useLayoutEffect(() => {
        d3.select(tileMapGrid.current)
            .selectAll(`.${styles.gridCell}`)
            .data(data)
            .attr('x', (data) => data[columnKey] * cellSize)
            .attr('y', (data) => data[rowKey] * cellSize)
            .on('mousemove', (e, data) => {
                setElEvent(e);
                setTooltipData(data);
            })
            .on('mouseout', (d) => {
                setTooltipData(null);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, columnKey, rowKey]);

    return (
        <g ref={tileMapGrid}>
            {data.map((_, index) => (
                <rect key={index} className={styles.gridCell} stroke={stroke} width={cellSize} height={cellSize} />
            ))}
        </g>
    );
};

export default TileMapGrid;
