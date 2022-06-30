import React from 'react';
import '../styles/toolbar.scss';

const Toolbar = () => {
    return (
        <div className="toolbar">
            <button className="toolbar-btn brush"/>
            <button className="toolbar-btn rect"/>
            <button className="toolbar-btn circle"/>
            <button className="toolbar-btn eraser"/>
            <button className="toolbar-btn line"/>
            <button className="toolbar-btn colors"/>
            <button className="toolbar-btn undo"/>
            <button className="toolbar-btn redo"/>
            <button className="toolbar-btn save"/>
        </div>
    );
};

export default Toolbar;
