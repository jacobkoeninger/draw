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
            console.log('connected');
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


    canvasUpdate = (data, canvas) => {
        //console.log('Canvas', data.getSaveData());
        this.setState({canvas: canvas});
        this.state.socket.emit('updateCanvas', {
            'data': data.getSaveData(),
            'room': this.props.user.room
        });        
    }

    render() {

        this.state.socket.on('updateAllCanvases', (obj) => {
            //console.log(obj);
            if(obj.id != this.state.socket.id){
                this.state.canvas.loadSaveData(obj.data);
                //this.saveableCanvas.loadSaveData(obj.data);
            }
            //console.log(this.saveableCanvas);
        })
        
        return(
          <div>
            <CanvasDraw
                ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
                onChange={(canvasDraw) => {
                    this.canvasUpdate(canvasDraw, this.saveableCanvas);
                    this.setState({
                        canvas: this.saveableCanvas
                    });
                }}
                loadTimeOffset = {5}
            />
            <button onClick={() => {
                this.saveableCanvas.undo();
                this.setState({
                    canvas: this.saveableCanvas
                });
            }}>Undo</button>
            <button onClick={() => {
                this.saveableCanvas.clear();
                //FIXME: this doesn't update canvas
            }}>Clear</button>
            <button onClick={() => {
                console.log(this.state.socket)
            }}>Log data</button>
          </div>
        )
    }
}