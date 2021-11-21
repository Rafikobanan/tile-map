import React, { createContext, useContext, useState } from 'react';

const TooltipContext = createContext();

const TooltipProvider = ({ children }) => {
    const [elEvent, setElEvent] = useState({});
    const [tooltipData, setTooltipData] = useState(null);

    return (
        <TooltipContext.Provider
            value={{ tooltipData, elEvent, setElEvent, setTooltipData }}
        >
            {children}
        </TooltipContext.Provider>
    );
};

const useTooltip = () => {
    const context = useContext(TooltipContext);

    return context;
};

export { TooltipProvider, useTooltip };
