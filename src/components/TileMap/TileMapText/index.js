import { useLayoutEffect, useRef } from 'react';
import * as d3 from 'd3';
import styles from './styles.module.scss';

const TileMapText = ({ data, cellSize, columnKey, textCreators, fill }) => {
    const textRef = useRef(null);

    useLayoutEffect(() => {
        const calculateTextXPosition = (data) => data[columnKey] * cellSize + cellSize / 2 - cellSize * 0.4;

        const texts = d3.select(textRef.current)
            .selectAll(`.${styles.text}`)
            .data(data)
            .attr('x', calculateTextXPosition)
            .attr('y', (data) => (data.row * cellSize) + (cellSize / 2 - 5))
            .html('');

        textCreators.forEach((textCreator, index) => {
            texts
                .append('tspan')
                .attr('x', calculateTextXPosition)
                .attr('dy', index * 20)
                .text(textCreator)
        });
    }, [cellSize, columnKey, data, textCreators]);

    return (
        <g ref={textRef}>
            {data.map((_, index) => (
                <text key={index} className={styles.text} fill={fill} />
            ))}
        </g>
    );
};

export default TileMapText;
