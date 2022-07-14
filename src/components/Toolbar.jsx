import React, { useState } from 'react';
import '../styles/toolbar.scss';
import toolState from '../store/toolState';
import canvasState from '../store/canvasState';
import Brush from '../tools/Brush.js';
import Rect from '../tools/Rect.js';
import Circle from '../tools/Circle.js';
import Eraser from '../tools/Eraser.js';
import Line from '../tools/Line.js';
import { ReactComponent as BrushImg } from '../assets/images/brush.svg';
import { ReactComponent as CircleImg } from '../assets/images/circle.svg';
import { ReactComponent as RectImg } from '../assets/images/rect.svg';
import { ReactComponent as EraserImg } from '../assets/images/eraser.svg';
import { ReactComponent as LineImg } from '../assets/images/line.svg';
import { ReactComponent as UndoImg } from '../assets/images/undo.svg';
import { ReactComponent as RedoImg } from '../assets/images/redo.svg';
import { ReactComponent as SaveImg } from '../assets/images/save.svg';

const Toolbar = () => {
    const [tool, setTool] = useState('brush');
    const tools = [
        { name: 'brush', svg: <BrushImg/> },
        { name: 'rect', svg: <RectImg/> },
        { name: 'circle', svg: <CircleImg/> },
        { name: 'eraser', svg: <EraserImg/> },
        { name: 'line', svg: <LineImg/> },
    ];

    const setStateTool = (tool) => {
        setTool(tool);

        switch (tool) {
            case 'brush':
                toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionID));
                break;
            case 'rect':
                toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionID));
                break;
            case 'circle':
                toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionID));
                break;
            case 'eraser':
                toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionID));
                break;
            case 'line':
                toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionID));
                break;
            default:
                break;
        }
    }

    const saveImage = () => {
        const a = document.createElement('a');
        a.href = canvasState.canvas.toDataURL();
        a.download = `${canvasState.sessionID}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        <div className="toolbar">
            { tools.map((t, index) => (
                <button className={`toolbar-btn brush ${tool === t.name ? 'active' : null}`}
                        key={index}
                        onClick={() => setStateTool(t.name)}>
                    {t.svg}
                </button>
            )) }

            <button className="toolbar-btn ml-auto undo"
                    onClick={() => canvasState.undo()}>
                <UndoImg/>
            </button>
            <button className="toolbar-btn redo"
                    onClick={() => canvasState.redo()}>
                <RedoImg/>
            </button>
            <button className="toolbar-btn save"
                    onClick={() => saveImage()}>
                <SaveImg/>
            </button>
        </div>
    );
};

export default Toolbar;
