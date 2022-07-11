import React, { useState } from 'react';
import '../styles/toolbar.scss';
import toolState from '../store/toolState';
import arrow from '../assets/arrow.svg';

const SettingBar = () => {
    const [lineWidth, setLineWidth] = useState(1);

    const increaseLineWidth = () => {
        if (lineWidth >= 20) {
            return;
        }
        setLineWidth(lineWidth + 1);
        toolState.setLineWidth(lineWidth)
    }

    const decreaseLineWidth = () => {
        if (lineWidth <= 1) {
            return;
        }
        setLineWidth(lineWidth - 1);
        toolState.setLineWidth(lineWidth)
    }

    return (
        <div className="toolbar setting-bar">
            <label className="ml-10">Line Width:</label>

            <div className="line-width ml-5">
                <img className="arrow"
                     onClick={() => increaseLineWidth()}
                     src={arrow}
                     alt={arrow}/>
                <span>{lineWidth}</span>
                <img className="arrow arrow-reverse"
                     onClick={() => decreaseLineWidth()}
                     src={arrow}
                     alt={arrow}/>
            </div>

            <label className="ml-10"
                   htmlFor="stroke-color">Line Color:</label>
            <input onChange={(e) => toolState.setStrokeColor(e.target.value)}
                   type="color"
                   className="ml-5"
                   id="stroke-color"/>

            <label className="ml-10"
                   htmlFor="fill-color">Fill Color:</label>
            <input onChange={(e) => toolState.setFillColor(e.target.value)}
                   className="ml-5"
                   type="color"
                   id="fill-color"/>
        </div>
    );
};

export default SettingBar;
