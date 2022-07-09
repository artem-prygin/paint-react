import React from 'react';
import '../styles/toolbar.scss';
import toolState from '../store/toolState';

const SettingBar = () => {
    return (
        <div className="toolbar setting-bar">
            <label className="ml-10"
                   htmlFor="line-width">Line Width</label>
            <input onChange={(e) => toolState.setLineWidth(e.target.value)}
                   type="number"
                   className="ml-10"
                   id="line-width"
                   min={1}
                   max={50}
                   defaultValue={1}/>

            <label className="ml-10"
                   htmlFor="stroke-color">Line Color</label>
            <input onChange={(e) => toolState.setStrokeColor(e.target.value)}
                   type="color"
                   className="ml-10"
                   id="stroke-color"/>
        </div>
    );
};

export default SettingBar;
