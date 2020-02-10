import React from 'react';

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
            roomNumber: ""
        }   
    }

    setNickname = () => {
        //TODO: check if name is taken
        console.log('Set nickname', this.state.nickname)
    }
    
    joinRoom = () => {
        // make sure nickname is set
        console.log('Join room', this.state.roomNumber)
    }

    createRoom = _ => {
        // make sure nickname is set
        console.log('Create room')
    }

    render(){
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