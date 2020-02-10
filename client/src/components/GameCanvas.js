import React from 'react';
import CanvasDraw from "react-canvas-draw";
import io from 'socket.io-client';


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

    socket = io(`http://localhost:3001`);

    /* io.on('connection', (socket) => {
        socket.on('updateAllCanvases', (data) => {
            console.log('emit data', data);
        });
    }) */

    


    componentDidMount() {
        this.socket.on('connection', (socket) => {
            console.log('connected')
            
            //socket.broadcast.emit('hi');
            //socket.broadcast.emit('test');
            //socket.emit('test');
        });
    }

    componentDidUpdate = () => {
        console.log('canvas updated')
    }

    getCanvas = () => {
        return this.state.canvas;
    }


    canvasUpdate = (data) => {
        //console.log('Canvas', data.getSaveData());
        this.socket.emit('canvasUpdate', data.getSaveData());
    }

    render() {

        this.socket.on('updateAllCanvases', (e) => {
            this.saveableCanvas.loadSaveData(e);
        })
        
        return(
          <div>
            { /* this.getCanvas() */ }
            <CanvasDraw
                ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
                onChange={(canvasDraw) => this.canvasUpdate(canvasDraw)}
            />
            <button onClick={() => {
                this.saveableCanvas.undo();
            }}>Undo</button>
          </div>
        )
    }
}