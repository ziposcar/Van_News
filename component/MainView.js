/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  DrawerLayoutAndroid,
  Dimensions,
  DeviceEventEmitter,
  Button,
} from 'react-native';
import FlatListMenu from './FlatList';
import DrawerLayoutMenu from './DrawerLayout';

let screenWidth = Dimensions.get('screen').width; 

export default class MainView extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerLeft: null,
    headerTitleStyle: screenProps.style.headerTitleStyle,
    headerStyle: screenProps.style.headerStyle,
  })
  constructor(props) {
    super(props)
    this.state = {
      // the url which used in WebView
      url: '',
    }
  }

  componentDidMount() {
    // change page to news' detail 
    this.subscription = DeviceEventEmitter.addListener('ToWebView', (data) => {
      // set url which used in WebView
      this.setState({ url: data });
      if (data !== '') {
        this.props.navigation.navigate('WebViewMenu', { url: data });
      }
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  render() {
    let navigationView = (<DrawerLayoutMenu style={this.props.screenProps.style} />);  // object of the sidebar view
    let drawerLayoutAndroid = (
      <DrawerLayoutAndroid
        drawerWidth={screenWidth * 2 / 3}  //the width of the sidebar
        drawerPosition={DrawerLayoutAndroid.positions.Left} //put the sidebar in the left of the screen
        renderNavigationView={() => {
          return navigationView;
        }}
      >
        <View style={styles.FlatList}>
          <FlatListMenu style={this.props.screenProps.style} />
        </View>
      </DrawerLayoutAndroid>
    );

    return drawerLayoutAndroid; 
  }
}

const styles = StyleSheet.create({
  FlatList: {
    alignItems: 'flex-end',
    height: Dimensions.get('window').height - 70,
    width: Dimensions.get('window').width,
  },
});