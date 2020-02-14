import React from 'react';
import {
    List,
    Avatar
} from 'antd';

export default class UserList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            users: props.users,
            socket: props.socket,
            artist: null
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

    getNickname = () => {
        if(this.state.artist){
            return this.state.artist.nickname;
        } else {
            return '';
        }
    }

    render(){

        this.state.socket.on('game info', (game) => {
            this.setState({
                users: game.players,
                artist: game.current_artist
            });
        });

        return(
            <div>
                <h4> { this.getNickname() } </h4>
                <List
                    itemLayout="vertical"
                    dataSource={this.state.users}
                    renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={<a href="#">{item.nickname}</a>}
                        />
                    </List.Item>
                    )}
                />
            </div>
        );
    }
}