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
            canvas: canvas,
            socket: props.socket
        }
    }

    saveableCanvas;

    //socket = io(`http://localhost:3001`);

    /* io.on('connection', (socket) => {
        socket.on('updateAllCanvases', (data) => {
            console.log('emit data', data);
        });
    }) */

    


    componentDidMount() {

        this.state.socket.on('connection', (socket) => {
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
        this.state.socket.emit('canvasUpdate', {
            'id': this.state.socket.id,
            'data': data.getSaveData()
        });        
    }

    render() {

        this.state.socket.on('updateAllCanvases', (obj) => {
            /* if(obj.id != this.state.socket.id){
                this.saveableCanvas.loadSaveData(obj.data);
            } */
            console.log('my id', this.state.socket.id);
            console.log('artist id', obj.id);
        })

        this.state.socket.on('test', _ => console.log('test'))        
        
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
            <button onClick={() => {
                this.saveableCanvas.clear();
            }}>Clear</button>
            <button onClick={() => {
                console.log(this.state.socket)
            }}>Log data</button>
          </div>
        )
    }
}