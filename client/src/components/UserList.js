import React from 'react';
import {
    List,
    Avatar
} from 'antd';

export default class UserList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            users: props.users
        }
    }

    render(){
        return(
            <div>
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