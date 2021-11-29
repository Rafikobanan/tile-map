import { useLayoutEffect, useRef } from "react";
import styles from './styles.module.scss';
import * as d3 from 'd3';

const TileMapPercentBar = ({ data, rowKey, columnKey, cellSize, dataKey, fill }) => {
    const barRef = useRef(null);

    useLayoutEffect(() => {
        d3.select(barRef.current)
            .selectAll(`.${styles.bar}`)
            .data(data)
            .attr('x', (data) => data[columnKey] * cellSize)
            .attr('y', (data) => data[rowKey] * cellSize + cellSize * (100 - data[dataKey]) / 100)
            .attr('height', (data) => cellSize * data[dataKey] / 100);
    }, [cellSize, data, dataKey, rowKey, columnKey]);

    return (
        <g ref={barRef}>
            {data.map((_, index) => (
                <rect key={index} className={styles.bar} width={cellSize} fill={fill} />
            ))}
        </g>
    );
};

export default TileMapPercentBar;
