import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, YellowBox, Linking} from 'react-native';
import {WebView} from 'react-native-webview';
import * as Keychain from 'react-native-keychain';
import io from 'socket.io-client';
import LoginInApp from './components/LoginInApp';
import Home from './components/Home';
import PushNotification from 'react-native-push-notification';
import RemotePushController from './components/RemotePushController';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      loggedInStatus: false,
    };

    // PushNotification.configure({
    //   // (optional) Called when Token is generated (iOS and Android)
    //   onRegister: function(token) {
    //     console.log('TOKEN:', token);
    //   },
    //   // (required) Called when a remote or local notification is opened or received
    //   onNotification: function(notification) {
    //     alert(notification.title);
    //     console.log('REMOTE NOTIFICATION ==>', notification);
    //     // process the notification here
    //   },
    //   // Android only: GCM or FCM Sender ID
    //   senderID: '680385257512',
    //   popInitialNotification: true,
    //   requestPermissions: true,
    // });
  }

  componentDidMount() {
    //console.log('bg', isBackgroundRestricted();
    Keychain.getGenericPassword().then(res => {
      if (res) {
        console.log(res);
        this.setLoginStatus();
      }
    });
  }

  setLoginStatus = () => {
    this.setState({loggedInStatus: !this.state.loggedInStatus});
  };
  render() {
    return (
      <View style={styles.container}>
        {this.state.loggedInStatus ? (
          <RemotePushController
            setStatus={this.setLoginStatus}
            loggedInStatus={this.state.loggedInStatus}
          />
        ) : (
          <LoginInApp setStatus={this.setLoginStatus} />
        )}
        {/* <RemotePushController /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  container: {
    height: 550,
  },
});
