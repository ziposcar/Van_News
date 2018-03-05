import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  WebView,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default class WebViewMenu extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    header: null,
  })
  constructor(props) {
    super(props);
    this.state = {
      url: '',
    }
  }

  render() {
    
    return (
      <View style={styles.container}>
        <Text>{'url: ' + this.props.navigation.state.params.url}</Text>{/*get url by params by navigator from the superior component*/}
        <WebView
          style={{ width: width, height: height - 20, backgroundColor: 'gray' }}
          source={{ uri: this.props.navigation.state.params.url, method: 'GET' }}
          javaScriptEnabled={true}//to enable javascript in webview
          domStorageEnabled={true}//open the DOM Storage
          scalesPageToFit={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: 20,
  },
});  