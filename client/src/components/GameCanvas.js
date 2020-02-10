import React from 'react';
import CanvasDraw from "react-canvas-draw";


export default class GameCanvas extends React.Component {

    constructor(props){
        super(props);
        let canvas = <CanvasDraw />
        /* canvas.onChange = () => {
            console.log('change')
        } */
        this.state = {
            canvas: canvas
        }
    }

    saveableCanvas;

    componentDidMount() {
        
    }

    componentDidUpdate = () => {
        console.log('canvas updated')
    }

    getCanvas = () => {
        return this.state.canvas;
    }

    printData = () => {
        console.log(this.state.canvas);
    }
    saveData = () => {
        console.log('save')
    }

    canvasUpdate = (data) => {
        console.log('canvas data', data.getSaveData());
    }

    render() {
        return(
          <div>
            { /* this.getCanvas() */ }
            <CanvasDraw
                ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
                onChange={(canvasDraw) => this.canvasUpdate(canvasDraw)}
            />
            <button onClick={this.printData}>printData</button>
            <button onClick={this.saveData}>saveData</button>
            <button onClick={() => {
                this.saveableCanvas.undo();
            }}>Undo</button>
          </div>
        )
    }
}