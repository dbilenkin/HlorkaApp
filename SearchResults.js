'use strict';

import React, { Component } from 'react'
import SocketIOClient from 'socket.io-client';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  ListView,
  Text
} from 'react-native';

var PropertyView = require('./PropertyView');

var styles = StyleSheet.create({
  container: {
    marginTop: 65,
    alignItems: 'center'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    width: 200,
    height: 60,
    justifyContent: 'center'
  },
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 25,
    width: 80,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  }
});

class SearchResults extends Component {

  constructor(props) {
    super(props);
    var socket = new SockJS('http://localhost:8090/websocket/tracker');
    this.stompClient = Stomp.over(socket);

    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.games),
      name: this.props.name,
      games: this.props.games
    };
    var self = this;
    this.stompClient.connect({},function(sessionId) {
        self.stompClient.subscribe('/topic/addGame', function(response) {
          console.log('This is the body of a message on the subscribed queue:', response);
          self._addGame(response.body);
        });

        self.stompClient.subscribe('/topic/deleteGame', function(response) {
          console.log('This is the body of a message on the subscribed queue:', response);
          self._deleteGame(response.body);
        });
    });

    //this.socket = SocketIOClient('http://localhost:8080/topic/game');
    //this.socket.on('game', this._addGame(game));

    /*var ws = new WebSocket('http://localhost:8080/topic/game');

    ws.onmessage = (e) => {
      // a message was received
      console.log(e.data);
      this._addGame(e);
    };*/


  }

  componentDidMount() {

    //var stompClient = new Stomp('localhost', 8080);


  }

  _addGame(body) {
    var game = JSON.parse(body);
    this.state.games = this.state.games.concat([game])
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.state.games),
      name: this.props.name,
      games: this.state.games
    });
  }

  _deleteGame(body) {
    var game = JSON.parse(body);
    this.state.games = this.state.games.filter(el => el.id != game.id);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.state.games),
      name: this.props.name,
      games: this.state.games
    });
  }

  createGame() {
    fetch('http://localhost:8090/api/games', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: this.props.name
    })
  }

  deleteGame(id) {
    fetch('http://localhost:8090/api/games/' + id, {
      method: 'DELETE',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      }
    })
  }

  joinGame(id) {
    var self = this;
    fetch('http://localhost:8090/api/games/' + id + '/join', {
      method: 'PUT',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: this.props.name
    })
    .then(function(response) {
      self.rowPressed(id);
    })
  }

  renderRow(rowData, sectionID, rowID) {

    return (

        <View>
          <View style={styles.rowContainer}>
            <View  style={styles.flowRight}>
              <TouchableHighlight onPress={() => this.joinGame(rowData.id)}
                  underlayColor='#dddddd'>
                  <Text style={styles.price}>Join</Text>
              </TouchableHighlight>
              <Text style={styles.title}
                    numberOfLines={1}>{rowData.name}</Text>
              <TouchableHighlight style={styles.button}
                  underlayColor='#99d9f4'>
                <Text
                  style={styles.buttonText}
                  onPress={() => this.deleteGame(rowData.id)}>
                  X
                </Text>
              </TouchableHighlight>

            </View>
          </View>
          <View style={styles.separator}/>
        </View>

    );
  }

  rowPressed(id) {
    var name = this.props.name;
    var game = this.props.games.filter(prop => prop.id === id)[0];

    this.props.navigator.push({
      title: "Game",
      component: PropertyView,
      passProps: {game: game}
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.button}
            underlayColor='#99d9f4'>
          <Text
            style={styles.buttonText}
            onPress={this.createGame.bind(this)}>
            Create Game
          </Text>
        </TouchableHighlight>
        <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}/>
      </View>
    );
  }

}

module.exports = SearchResults;
