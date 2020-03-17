import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import PushNotification from 'react-native-push-notification';
import Home from './Home';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

export let notificationData = '';
const RemotePushController = props => {
  const [data, setData] = useState();
  const [user, setUser] = useState();
  useEffect(() => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.log('TOKEN:', token);
        Keychain.getGenericPassword().then(res => {
          if (res) {
            axios
              .post(`http://192.168.29.83:5001/store-device-token`, {
                data: {
                  user: res.username,
                  deviceToken: token,
                },
              })
              .then(res => console.log('Device token', res));
          }
        });
      },
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        setData(notification.test);
        notificationData = data;
        console.log('REMOTE NOTIFICATION ==>', notification);
        refreshHome(notification.test);
        // process the notification here
      },
      // onMessageReceived: function(message) {
      //   console.log('message', message);
      // },

      // Android only: GCM or FCM Sender ID
      senderID: '680385257512',
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, []);

  function refreshHome(data) {
    this.home.refresh(data);
  }

  console.log('data in rpn', data);
  return (
    <View>
      <Home
        ref={home => (this.home = home)}
        setStatus={props.setStatus}
        loggedInStatus={props.loggedInStatus}
      />
    </View>
  );
};
export default RemotePushController;
