'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  View,
  Text
} from 'react-native';

import WebSocket from '../lib/socket';

var styles = StyleSheet.create({
  container: {
    marginTop: 65
  },
  heading: {
    backgroundColor: '#F8F8F8',
  },
  separator: {
    height: 1,
    backgroundColor: '#DDDDDD'
  },
  image: {
    width: 400,
    height: 300
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 5,
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    margin: 5,
    color: '#656565'
  },
  description: {
    fontSize: 18,
    margin: 5,
    color: '#656565'
  }
});

class GameView extends Component {

  componentDidMount() {

    //var stompClient = new Stomp('localhost', 8080);
    console.log("componentDidMount");
    var self = this;
    


  }

  render() {
    var game = this.props.game;

    return (
      <View style={styles.container}>
        <Text style={styles.description}>{game.name}</Text>
        { game.players.map((player) => {
          return <Text key={player.user.id} style={styles.description}>{player.user.login}</Text>
        })}

      </View>
    );
  }
}

module.exports = GameView;
