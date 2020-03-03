import React from 'react';
import {
    List,
    Icon,
    Avatar
} from 'antd';

export default class UserList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            users: props.users,
            socket: props.socket,
            artist: null,
            correctPlayers: [],
            
        }
    }

    componentDidUpdate = () => {
        console.log('user list updated')
        if(this.props.artist){
            /* this.setState({
                artist: this.props.artist
            }); */
        }
    }

    getArtistNickname = () => {
        if(this.state.artist){
            return this.state.artist.nickname;
        } else {
            return '';
        }
    }

    getStar = (user) => {
        if(this.state.correctPlayers){
            let playerFound;

            this.state.correctPlayers.forEach((player) => {
                if(player.id === user.id){
                    playerFound = player;
                }
            });

            if(playerFound){
                return <Icon type="star" />;
            } else {
                return;
            }


        }
    }

    render(){

        this.state.socket.on('game info', (game) => {
            this.setState({
                users: game.players,
                artist: game.current_artist,
                correctPlayers: game.correct_players
            });
        });

        return(
            <div className="userList">
                <h4> { this.getArtistNickname() } </h4>
                <List
                    itemLayout="vertical"
                    dataSource={this.state.users}
                    renderItem={user => (
                    <List.Item>
                        { /* this.getStar(user.id) */ }
                        <List.Item.Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={<a href="#">{user.nickname}</a>}
                        />
                    </List.Item>
                    )}
                />
            </div>
        );
    }
}