import React from 'react';
import io from 'socket.io-client';
import {Redirect} from "react-router-dom";

import {
    Button,
    Input
} from 'antd';

export default class Home extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            socket: props.socket,
            nickname: "",
            roomNumber: "",
            roomCreated: false
        }
    }

    setNickname = () => {
        //TODO: check if name is taken
        if(this.state.nickname != "") this.state.socket.emit('send-nickname', this.state.nickname);
    }
    
    joinRoom = () => {
        // make sure nickname is set
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
        console.log('Create room')
        if(this.state.nickname != ""){
            this.state.socket.emit('create room');
        } else {
            console.error("Please set nickname");
        }

        this.state.socket.on('room created', () => {
            console.log('created room successfully')
            this.setState({
                roomCreated: true
            });
        });        

    }



    render(){
        if (this.state.roomCreated) {
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