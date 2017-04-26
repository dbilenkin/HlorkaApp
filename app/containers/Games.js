'use strict';

import React, { Component } from 'react';
import WebSocket from '../lib/socket';
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  ListView,
  ScrollView,
  Text
} from 'react-native';

import GameView from './GameView';
import ErrorModal from '../components/modal'

var styles = StyleSheet.create({
  container: {
    marginTop: 65,
    alignItems: 'center',
    height: 500
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
  createbutton: {
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    width: 200,
    height: 60,
    justifyContent: 'center'
  },
  deletebutton: {
    backgroundColor: 'red',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 8,
    width: 40,
    height: 40,
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
    color: '#656565',
    marginRight: 20
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  }
});

class Games extends Component {

  constructor(props) {
    super(props);

    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.games),
      name: this.props.name,
      games: this.props.games
    };


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
    console.log("componentDidMount");
    var self = this;
    this.addGameSubscription = WebSocket.subscribe('/topic/addGame', function(response) {
      console.log('This is the body of a message on the subscribed queue:', response);
      self._addGame(response.body);
    });

    this.deleteGameSubscription = WebSocket.subscribe('/topic/deleteGame', function(response) {
      console.log('This is the body of a message on the subscribed queue:', response);
      self._deleteGame(response.body);
    });

    this.joinGameSubscription = WebSocket.subscribe('/topic/joinGame', function(response) {
      console.log('This is the body of a message on the subscribed queue:', response);
      self._joinGame(response.body);
    });


  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
    this.addGameSubscription.unsubscribe();
    this.deleteGameSubscription.unsubscribe();
    this.joinGameSubscription.unsubscribe();
  }

  _joinGame(body) {
    var game = JSON.parse(body);

    this.props.navigator.push({
      title: "Game",
      component: GameView,
      passProps: {game: game}
    });
  }

  _addGame(body) {
    var game = JSON.parse(body);
    var games = this.state.games.concat([game])
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(games),
      name: this.props.name,
      games: games
    });
  }

  _deleteGame(body) {
    var game = JSON.parse(body);
    var games = this.state.games.filter(el => el.id != game.id);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(games),
      name: this.props.name,
      games: games
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
      if (response.ok) {
        console.log("joinGame response");
      } else {
        console.log("Whoopsie Daisy!");
        self._errorModal.setModalVisible(true);
      }

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
              <TouchableHighlight style={styles.deletebutton}
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

  render() {
    return (

      <View style={styles.container}>
        <ErrorModal ref={(errorModal) => { this._errorModal = errorModal; }} />
        <TouchableHighlight style={styles.createbutton}
            underlayColor='#99d9f4'>
          <Text
            style={styles.buttonText}
            onPress={this.createGame.bind(this)}>
            Create Game
          </Text>
        </TouchableHighlight>
        <ScrollView>
          <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow.bind(this)}/>
        </ScrollView>
      </View>
    );
  }

}

module.exports = Games;
