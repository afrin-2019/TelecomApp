import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {WebView} from 'react-native-webview';
import {token} from './LoginInApp';
import axios from 'axios';
import {notificationData} from './RemotePushController';
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      data: '',
    };
  }

  componentDidMount() {
    Keychain.getGenericPassword().then(res => {
      if (res) {
        this.setState({username: res.username});
        this.intervalID = setInterval(
          () => this.validateUser(res.username, res.password),
          60000,
        );
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  logOut = () => {
    Keychain.resetGenericPassword();
    this.props.setStatus();
  };

  refresh = data => {
    this.setState({data: data});
  };

  validateUser = (userName, password) => {
    // console.log('in validation');
    let request = {};
    let first_val = {};
    let second_val = {};
    first_val['Username'] = userName;
    second_val['Password'] = password;
    request = Object.assign(first_val, second_val);

    axios
      .get(`http://192.168.29.83:5001/validate/ldap_user`, {
        params: request,
      })
      .then(res => {
        console.log('validation done - ', res.data);
        if (res.data === 'invalid') {
          this.logOut();
        }
      });
  };
  render() {
    console.log('token', token);

    return (
      <View>
        <View style={{height: 300}}>
          <Text>Home</Text>
          <WebView
            javaScriptEnabled={true}
            source={{
              uri:
                'http://192.168.29.83:3000?param=' +
                this.state.username +
                '&&data=' +
                this.state.data,
            }}
          />
        </View>
        <View style={{alignItems: 'center', margin: 10}}>
          <Button title="Log out" onPress={this.logOut} />
        </View>
      </View>
    );
  }
}

export default Home;
