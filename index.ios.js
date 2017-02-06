import React, { Component } from 'react';
import { AppRegistry, StyleSheet, NavigatorIOS } from 'react-native';

var SearchPage = require('./SearchPage');

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class HlorkaApp extends React.Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Hlorka!',
          component: SearchPage,
        }}/>
    );
  }
}

AppRegistry.registerComponent('HlorkaApp', () => HlorkaApp);
