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
            creatingOrJoining: null,
            
            createGameModalVisible: false,
            
            createGameMaxRounds: 10,
            createGameMaxPlayers: 2,
            createGameRoundLength: 30
        };
        this.joinRoomSocket();
    }


    showModal = () => {
        this.setState({
          nickModalVisible: true,
        });
      };
    
    handleNickOk = e => {
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
                //this.createRoom();
                this.setState({
                    createGameModalVisible: true
                })
            }
        }

    };

    handleNickCancel = e => {
        console.log(e);
        this.setState({
            nickModalVisible: false,
        });
    };

    handleCreateGameOk = e => {

        //if(this.state.createGameMaxPlayers && this.state.createGameMaxRounds && this.state.createGameRoundLength){
            
            this.createRoom();
        //}

    };

    handleCreateGameCancel = e => {
        console.log(e);
        this.setState({
            createGameModalVisible: false,
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
            this.state.socket.emit('create game', {
                user: this.props.user,
                max_players: this.state.createGameMaxPlayers,
                max_rounds: this.state.createGameMaxRounds,
                round_length: this.state.createGameRoundLength
            });
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
                        this.handleNickOk();
                    }}
                    onCancel={this.handleNickCancel}
                    >
                    <Input onChange={(e) => {
                        this.setState({ nickname: e.target.value })
                    }} placeholder="John Smith" suffix="Nickname" />
                </Modal>

                <Modal
                    title="Create game"
                    className="create_game_modal"
                    visible={this.state.createGameModalVisible}
                    onOk={() => {
                        this.handleCreateGameOk();
                    }}
                    onCancel={this.handleCreateGameCancel}
                    >
                    
                    
                    <Input value={this.state.createGameMaxRounds} onChange={(e) => {
                        this.setState({ createGameMaxRounds: e.target.value })
                    }} placeholder="Maximum number of rounds" suffix="# Rounds" />
                    <Input value={this.state.createGameMaxPlayers} onChange={(e) => {
                        this.setState({ createGameMaxPlayers: e.target.value })
                    }} placeholder="Maximum number of players" suffix="# Players" />
                    <Input value={this.state.createGameRoundLength} onChange={(e) => {
                        this.setState({ createGameRoundLength: e.target.value })
                    }} placeholder="Rounds Length (in seconds)" suffix="Round Length" />

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