import React, { useEffect, useState } from 'react';
import '../styles/toolbar.scss';
import toolState from '../store/toolState';
import canvasState from '../store/canvasState';
import Rect from '../tools/Rect.js';
import Circle from '../tools/Circle.js';
import Line from '../tools/Line.js';
import { ReactComponent as BrushImg } from '../assets/images/brush.svg';
import { ReactComponent as CircleImg } from '../assets/images/circle.svg';
import { ReactComponent as RectImg } from '../assets/images/rect.svg';
import { ReactComponent as EraserImg } from '../assets/images/eraser.svg';
import { ReactComponent as LineImg } from '../assets/images/line.svg';
import { ReactComponent as UndoImg } from '../assets/images/undo.svg';
import { ReactComponent as RedoImg } from '../assets/images/redo.svg';
import { ReactComponent as SaveImg } from '../assets/images/save.svg';
import Eraser from '../tools/Eraser.js';
import Brush from '../tools/Brush.js';

const Toolbar = () => {
    const [tool, setTool] = useState('brush');
    const tools = [
        { name: 'brush', svg: <BrushImg/> },
        { name: 'rect', svg: <RectImg/> },
        { name: 'circle', svg: <CircleImg/> },
        { name: 'eraser', svg: <EraserImg/> },
        { name: 'line', svg: <LineImg/> },
    ];

    useEffect(() => {
        setTool('brush');
    }, [canvasState.sessionID])

    const setStateTool = (tool) => {
        setTool(tool);

        switch (tool) {
            case 'brush':
                toolState.setTool(new Brush());
                break;
            case 'rect':
                toolState.setTool(new Rect());
                break;
            case 'circle':
                toolState.setTool(new Circle());
                break;
            case 'eraser':
                toolState.setTool(new Eraser());
                break;
            case 'line':
                toolState.setTool(new Line());
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
