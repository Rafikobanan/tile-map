import { useLayoutEffect, useRef } from "react";
import styles from './styles.module.scss';
import * as d3 from 'd3';

const TileMapPercentBar = ({ data, rowKey, cellSize, dataKey, fill }) => {
    const barRef = useRef(null);

    useLayoutEffect(() => {
        const barNode = barRef.current;

        d3.select(barNode)
            .selectAll(styles.bar)
            .data(data)
            .enter()
            .append('rect')
            .attr('class', styles.bar)
            .attr('x', (data) => data.column * cellSize)
            .attr('y', (data) => data[rowKey] * cellSize + cellSize * (100 - data[dataKey]) / 100)
            .attr('width', cellSize)
            .attr('height', (data) => cellSize * data[dataKey] / 100)
            .attr('fill', fill);

        return () => barNode.innerHTML = '';
    }, [cellSize, data, dataKey, fill, rowKey]);

    return <g ref={barRef}></g>;
};

export default TileMapPercentBar;
