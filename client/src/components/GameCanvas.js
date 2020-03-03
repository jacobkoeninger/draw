import React from 'react';
import CanvasDraw from "react-canvas-draw";
import io from 'socket.io-client';
import { TwitterPicker  } from 'react-color';

import {
    Button
} from 'antd';

export default class GameCanvas extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            canvas: null,
            socket: props.socket,
            isArtist: false,
            status: "",
            brushColor: "#333"
        }
    }

    saveableCanvas;

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
            if(game.status){
                this.setState({
                    status: game.status
                });
            }
        });
    }

    componentDidUpdate = () => {
        //console.log('canvas updated');
    }

    getCanvas = () => {
        return this.state.canvas;
    }


    canvasUpdate = (data, canvas) => {
        //console.log(data.getSaveData());
        console.log('drawing');
        if(this.state.isArtist){
            this.setState({canvas: canvas});
            this.state.socket.emit('updateCanvas', {
                //TODO: compress data either here or on the server 
                // https://github.com/pieroxy/lz-string
                'data': data.getSaveData(),
                'room': this.props.user.room
            });
        }
    }

    
    getColorPicker = () => {
        let colorPicker = <TwitterPicker triangle={"hide"} color={ this.state.brushColor } onChangeComplete={ (color) => { this.setState({ brushColor: color.hex }) } } />
        if(this.state.isArtist){
            return colorPicker;
        } else {
            return;
        }
    }

    render() {

        this.state.socket.on('updateAllCanvases', (obj) => {
            console.log(this.state.status);
            if(!this.state.isArtist && this.state.status === "active"){
                if(obj.id != this.state.socket.id){

                    if(this.state.canvas) this.state.canvas.loadSaveData(obj.data);                   
                    if(this.saveableCanvas) this.saveableCanvas.loadSaveData(obj.data, true);

                }
                //console.log(this.saveableCanvas);
            }
        });

        this.state.socket.on('clear boards', () => {
            //FIXME: breaking stuff
            if(this.saveableCanvas){
                this.saveableCanvas.clear();
            } else if (this.state.canvas){
                //this.state.canvas.clear();
            }
        });

        return(
          <div>
            <CanvasDraw
                ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
                onChange={(canvasDraw) => {
                    this.canvasUpdate(canvasDraw, this.saveableCanvas);
                    /* this.setState({
                        canvas: this.saveableCanvas
                    }); */
                }}                
                canvasWidth = {900}
                canvasHeight = {500}
                brushColor = {this.state.brushColor}
                immediateLoading = {true}
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
            
            { this.getColorPicker() }
          </div>
        )
    }
}