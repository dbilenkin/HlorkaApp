import React, { Component } from 'react';
import { AppRegistry, StyleSheet, NavigatorIOS } from 'react-native';

var Home = require('./app/containers/Home');

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
          component: Home,
        }}/>
    );
  }
}

AppRegistry.registerComponent('HlorkaApp', () => HlorkaApp);
