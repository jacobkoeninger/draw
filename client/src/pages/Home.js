import React from 'react';
import io, { Socket } from 'socket.io-client';
import {Redirect} from "react-router-dom";

import {
    Button,
    Input,
    Icon,
    Modal,
    notification,
    Row,
    Col
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
            roomJoined: false,
            nickModalVisible: false,
            creatingOrJoining: null
        };
        this.joinRoomSocket();
    }


    showModal = () => {
        this.setState({
          nickModalVisible: true,
        });
      };
    
    handleOk = e => {
        console.log(e);
        this.setState({
            nickModalVisible: false,
        });

        if(this.state.nickname !== ""){

            this.props.setNickname(this.state.nickname);
            this.state.socket.emit('send-nickname', this.state.nickname);

            if(this.state.creatingOrJoining == "joining"){
                this.joinRoom();
            } else if (this.state.creatingOrJoining == "creating"){
                this.createRoom();
            }
        }

    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            nickModalVisible: false,
        });
    };


    componentDidMount = () => {
        //console.log(this.props.user)

        this.state.socket.on('notification', (obj) => {            
            notification[obj.type]({
                message: obj.message,
                placement: "bottomRight",
                description:
                  obj.description,
            });            
        })

    }

    joinRoom = () => {
        if(this.state.nickname != "" && this.state.roomNumber != "") {
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
            this.state.socket.emit('create room', this.props.user);
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
                
                <Modal
                    title="Set nickname"
                    visible={this.state.nickModalVisible}
                    onOk={() => {
                        this.handleOk();
                    }}
                    onCancel={this.handleCancel}
                    >
                    <Input onChange={(e) => {
                        this.setState({ nickname: e.target.value })
                    }} placeholder="John Smith" suffix="Nickname" />
                </Modal>
                <Row>
                    <Row>
                        <Col span={4} offset={10}>
                            <h1>
                                Draw
                            </h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4} offset={10} >
                            <div className="homeFormGroup">
                                <Input onChange={(e) => {this.setState({roomNumber: e.target.value})}}  placeholder="Room #" />
                                <Button size="large" type="" onClick={() => {
                                    this.setState({ creatingOrJoining: "joining" });
                                    this.showModal();
                                }}><Icon type="enter" /></Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4} offset={10} >
                            <div className="homeFormGroup">
                                <Button size="large" type="" onClick={() => {
                                    this.setState({ creatingOrJoining: "creating" });
                                    this.showModal();
                                }}><Icon type="plus" /></Button>
                            </div>
                        </Col>
                    </Row>
                </Row>

            </div>
        );
    }
}