import { useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useTooltip } from '../tooltipContext';
import styles from './styles.module.scss';

const TileMapTooltip = ({ children }) => {
    const tooltipRef = useRef(null);
    const { tooltipData, elEvent } = useTooltip();

    useLayoutEffect(() => {
        const tooltipNode = tooltipRef.current;

        if (!elEvent || !tooltipNode) return;

        const coords = elEvent.target.getBoundingClientRect();
        const tooltipWidth = tooltipNode.offsetWidth;
        const { clientWidth } = document.body;
        const left = tooltipWidth + coords.left > clientWidth ? clientWidth - tooltipWidth - 5 : coords.left;

        tooltipNode.style.left = `${left}px`;
        tooltipNode.style.top = `${elEvent.pageY + 30}px`;
    }, [tooltipData, elEvent]);

    if (!tooltipData) return null;

    return ReactDOM.createPortal(<div ref={tooltipRef} className={styles.tooltip}>{children(tooltipData)}</div>, document.body);
};

export default TileMapTooltip;
