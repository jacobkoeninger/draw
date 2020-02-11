import React from 'react';
import io from 'socket.io-client';
import {Redirect} from "react-router-dom";

import {
    Button,
    Input
} from 'antd';

export default class Home extends React.Component {

    /* 
        TODO:
        - only allow users to join a lobby that exists
    */

    constructor(props){
        super(props);
        this.state = {
            socket: props.socket,
            nickname: "",
            roomNumber: "",
            roomJoined: false
        };
        this.joinRoomSocket();
    }

    componentDidMount = () => {
        //console.log(this.props.user)
    }

    setNickname = () => {
        if(this.state.nickname != ""){
            this.state.socket.emit('send-nickname', this.state.nickname)
            this.props.setNickname(this.state.nickname);
        };
    }
    
    joinRoom = () => {
        if(this.state.nickname != "" && this.state.roomNumber != "") {
            //this.props.setRoom(this.state.roomNumber);
            this.state.socket.emit('join game', {roomId: this.state.roomNumber, user: this.props.user} );
        };
    }

    createRoom = _ => {
        /* 
            make sure nickname is set
            add room to user in users array?
            on the backend, socket.join(random name)
            load board page. (add room id as a prop somehow?)
            have room id in the url?

            Don't change to board page until the backend emits back to the frontend confirming the room was joined
         */
        if(this.state.nickname != ""){
            //this.props.setRoom(this.state.roomNumber);
            console.log('does this work', this.props.user);
            this.state.socket.emit('create room', this.props.user); //?
        } else {
            console.error("Please set nickname");
        }

             

    }

    joinRoomSocket = _ => {
        this.state.socket.on('game joined', (GAME) => {
            if(GAME != null) {
                console.log('game joined successfully', GAME.room);
                
                // FIXME: it is probably better to set the room here, so that we now that the user joined the room successfully
                this.props.setRoom(GAME.room);
                this.setState({
                    roomJoined: true
                });

            } else {
                console.error('Room not found');
            }

        });   
    }



    render(){
        if (this.state.roomJoined) {
            return <Redirect to={"/board"} />
        }
        return (
            <div>
                <h4>Home</h4>
                
                <div className="homeFormGroup">
                    <Input onChange={(e) => {this.setState({nickname: e.target.value})}} placeholder="Nickname" />
                    <Button type="primary" onClick={this.setNickname} >Set</Button>
                </div>

                <div className="homeFormGroup">
                    <Input onChange={(e) => {this.setState({roomNumber: e.target.value})}}  placeholder="Room #" />
                    <Button type="primary" onClick={this.joinRoom}>Join</Button>
                </div>

                <div className="homeFormGroup">
                    <Button type="primary" onClick={this.createRoom}>Create Room</Button>
                </div>
            </div>
        );
    }
}