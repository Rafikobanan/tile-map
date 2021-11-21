import { useLayoutEffect, useRef } from 'react';
import * as d3 from 'd3';
import styles from './styles.module.scss';

const TileMapText = ({ data, cellSize, columnKey, textCreators, fill }) => {
    const textRef = useRef(null);

    useLayoutEffect(() => {
        const textNode = textRef.current;
        const calculateTextXPosition = (data) => data[columnKey] * cellSize + cellSize / 2 - cellSize * 0.4;

        const text = d3.select(textNode)
            .selectAll(styles.text)
            .data(data)
            .enter()
            .append('text')
            .attr('class', styles.text)
            .attr('x', calculateTextXPosition)
            .attr('y', (data) => (data.row * cellSize) + (cellSize / 2 - 5))
            .attr('fill', fill);

        textCreators.forEach((textCreator, index) => {
            text
                .append('tspan')
                .attr('x', calculateTextXPosition)
                .attr('dy', index * 20)
                .text(textCreator)
        });

        return () => textNode.innerHTML = '';
    }, [cellSize, columnKey, data, fill, textCreators]);

    return <g ref={textRef}></g>;
};

export default TileMapText;
