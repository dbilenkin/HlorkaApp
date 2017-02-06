'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Image
} from 'react-native';

var SearchResults = require('./SearchResults');

var styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
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
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  image: {
    width: 217,
    height: 138
  }
});

function urlForQueryAndPage(key, value, pageNumber) {

  return 'http://localhost:8090/api/games';
};

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      isLoading: false,
      message: ''
    };
  }

  onSearchTextChanged(event) {
    console.log('onSearchTextChanged');
    this.setState({ searchString: event.nativeEvent.text });
    console.log(this.state.searchString);
  }

  _executeQuery(query) {
    console.log(query);
    this.setState({ isLoading: true });

    fetch(query)
    .then(response => response.json())
    .then(json => {
      console.log(json);
      this._handleResponse(json);
    })
    .catch(error =>
       this.setState({
        isLoading: false,
        message: 'Something bad happened ' + error
     }));
  }

  _handleResponse(response) {
    this.setState({ isLoading: false , message: '' });
    if (response) {
      this.props.navigator.push({
        title: this.state.searchString,
        component: SearchResults,
        passProps: {games: response, name: this.state.searchString}
      });
    } else {
      this.setState({ message: 'Location not recognized; please try again.'});
    }
  }

  onSearchPressed() {
    var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
    this._executeQuery(query);
  }

  render() {
    console.log('SearchPage.render');

    var spinner = this.state.isLoading ?
    ( <ActivityIndicator
        size='large'/> ) :
    ( <View/>);

    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Type your name
        </Text>
        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            value={this.state.searchString}
            onChange={this.onSearchTextChanged.bind(this)}
            placeholder='your name goes here'/>
          <TouchableHighlight style={styles.button}
              underlayColor='#99d9f4'>
            <Text
              style={styles.buttonText}
              onPress={this.onSearchPressed.bind(this)}>
              Go
            </Text>
          </TouchableHighlight>
        </View>
        {spinner}
        <Text style={styles.description}>{this.state.message}</Text>
      </View>
    );
  }
}

module.exports = SearchPage;
