import React from 'react';
import GameCanvas from '../components/GameCanvas';
export default class Board extends React.Component {

    render(){
        return (
            <div>
                Board               
                <br />
                <GameCanvas />
            </div>
        );
    }
}