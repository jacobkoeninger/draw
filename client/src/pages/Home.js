import React from 'react';

import {
    Button,
    Input
} from 'antd';

export default class Home extends React.Component {

    /* 
       Title
       
       block inputs:
        - Room id,
        - (maybe room password),
        - nickname
        - join button

        Create room button (require nickname as well)

    */

    render(){
        return (
            <div>
                <h4>Home</h4>
                
                <div className="homeFormGroup">
                    <Input placeholder="Nickname" />
                    <Button type="primary">Set</Button>
                </div>

                <div className="homeFormGroup">
                    <Input placeholder="Room #" />
                    <Button type="primary">Join</Button>
                </div>

                <div className="homeFormGroup">
                    <Button type="primary">Create Room</Button>
                </div>

            </div>
        );
    }
}