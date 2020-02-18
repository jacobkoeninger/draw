import React from 'react';
import CanvasDraw from "react-canvas-draw";
import io from 'socket.io-client';
import {
    Button
} from 'antd';

export default class GameCanvas extends React.Component {

    /* 
        TODO:
        - only allow drawing if user is both the artist and game has started
    */

    
    constructor(props){
        super(props);
        let canvas = <CanvasDraw />
        /* canvas.onChange = () => {
            console.log('change')
        } */
        this.state = {
            canvas: canvas,
            socket: props.socket,
            isArtist: false
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
        
        this.state.socket.on('game info', (game) => {
            if(game.current_artist){
                if(game.current_artist.id === this.state.socket.id){
                    this.setState({
                        isArtist: true
                    });
                } else {
                    this.setState({
                        isArtist: false
                    });
                }
            }
        });

        /* this.state.socket.on('connection', (socket) => {
            console.log('connected');
        }); */
    }

    componentDidUpdate = () => {
        console.log('canvas updated')
        /* if(this.props.artist){
            if(this.props.artist.id == this.state.socket.id){
                this.setState({
                    isArtist: true
                });
            } else {
                this.setState({
                    isArtist: false
                });
            }
        } */
    }

    getCanvas = () => {
        return this.state.canvas;
    }


    canvasUpdate = (data, canvas) => {
        if(this.state.isArtist){
            //console.log('Canvas', data.getSaveData());
            this.setState({canvas: canvas});
            this.state.socket.emit('updateCanvas', {
                'data': data.getSaveData(),
                'room': this.props.user.room
            });
        }
    }

    render() {

        this.state.socket.on('updateAllCanvases', (obj) => {
            //console.log(obj);
            if(!this.state.isArtist){
                if(obj.id != this.state.socket.id){
                    //this.state.canvas.loadSaveData(obj.data);
                    this.saveableCanvas.loadSaveData(obj.data);
                }
                //console.log(this.saveableCanvas);
            }
        });

        this.state.socket.on('clear boards', () => {
            //FIXME: breaking stuff
            if(this.saveableCanvas){
                this.saveableCanvas.clear();
            } else if (this.state.canvas){
                this.state.canvas.clear();
            }
            
        });
        
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
                canvasWidth = {1000}
                canvasHeight = {500}
                loadTimeOffset = {5}
                disabled={!this.state.isArtist}
            />
            <Button type="ghost" onClick={() => {
                this.saveableCanvas.undo();
                this.setState({
                    canvas: this.saveableCanvas
                });
            }}>Undo</Button>
            <Button type="ghost" onClick={() => {
                this.saveableCanvas.clear();
                //FIXME: this doesn't update canvas
            }}>Clear</Button>
            <Button type="ghost" onClick={() => {
                console.log(this.state.socket)
            }}>Log data</Button>
          </div>
        )
    }
}