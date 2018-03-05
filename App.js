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
  Image,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import FlatListMenu from './component/FlatList';
// import SecondScreen from './SecondScreen';
// import WelcomeView from './Welcome';
import MainView from './component/MainView';
import WebViewMenu from './component/WebViewMenu';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWelcome: true,
      // the theme color index
      colorIndex: 0,
    }
  }
  //remove the listener
  componentWillUnmount() {
    this.subscription.remove();
  }
  //use timer to control the welcome page
  componentDidMount() {
    this.timer = setTimeout(
      () => {
        if (this.state.showWelcome === true) {
          this.setState({ showWelcome: false });
        }
      }, 2000);//this page will show 2 seconds
    //add listener to receive the theme params
    this.subscription = DeviceEventEmitter.addListener('ChangeColor', (data) => {
      this.setState({ colorIndex: data });
    });
  }

  render() {
    if (this.state.showWelcome) {
      //this is the welcome page
      return (
        <View style={styles.container}>
          <Image source={require('./image/IMG.jpg')} style={styles.Image2} />
        </View>
      );
    }
    else {
      return (
        //navigation is at the same level with welcome page
        <RootNavigator screenProps={{ style: style[this.state.colorIndex] }} />
      );
    }
  }
}
const RootNavigator = StackNavigator({
  MainView: {
    screen: MainView,
    navigationOptions: {
      headerTitle: 'Van_News',
    }
  },
  WebViewMenu: {
    screen: WebViewMenu,
    navigationOptions: {
      header: null,
    },
  },
});

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  text: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
  },
  Image2: {
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
  },
})
// export default RootNavigator;
const style = [
  //white
  StyleSheet.create({
    backgroundColor: {
      backgroundColor: '#ddd',
    },
    ItemBackGroundColor: {
      backgroundColor: '#fff',
    },
    textSwiper: {
      color: '#222',
      textShadowColor: '#ddd',
    },
    renderItem: {
      backgroundColor: '#eeeeee',
    },
    container: {
      backgroundColor: '#dddddd',
    },
    txt: {
      color: '#111',
    },
    txtBase: {
      color: '#555',
    },
    viewBorder: {
      borderColor: '#777',
    },
    DrawerLayoutText: {
      color: '#000',
    },
    headerTitleStyle: {
      color: '#000',
      alignSelf: 'center',
    },
    headerStyle: {
      backgroundColor: '#eee',
      height: 50,
    },
  }),
  //dark  
  StyleSheet.create({
    backgroundColor: {
      backgroundColor: '#555',
    },
    ItemBackGroundColor: {
      backgroundColor: '#444',
    },
    textSwiper: {
      color: '#ddd',
      textShadowColor: '#000',
    },
    renderItem: {
      backgroundColor: '#555555',
    },
    container: {
      backgroundColor: '#333333',
    },
    txt: {
      color: '#fff',
    },
    txtBase: {
      color: '#888',
    },
    viewBorder: {
      borderColor: '#000',
    },
    headerTitleStyle: {
      color: '#eee',
      alignSelf: 'center',
    },
    headerStyle: {
      backgroundColor: '#333',
      height: 50,
    },
  }),
]