import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import Home from './Home';
import {validateUser} from './ValidateUser';
import axios from 'axios';
import RemotePushController from './RemotePushController';
export let token;
class LoginInApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      error: false,
    };
  }

  handleLDAPLogin = () => {
    const username = this.state.userName;
    const password = this.state.password;
    axios
      .get(`http://192.168.29.83:5001/ldap/authenticate`, {
        params: {
          Username: this.state.userName,
          Password: this.state.password,
        },
      })
      .then(response => {
        if (response.data === 'invalid') {
          this.setState({error: true});
        } else {
          token = response.data.Token;
          Keychain.setGenericPassword(username, password).then(res => {
            this.props.setStatus();
          });
          // axios
          //   .post(`http://192.168.29.83:5001/store_token`, {
          //     data: {
          //       userid: username,
          //       token: token,
          //     },
          //   })
          //   .then(response => {
          //     console.log('response', response);
          //   });
        }
      });
  };

  handleLogin = () => {
    const username = this.state.userName;
    const password = this.state.password;
    let request = {};
    let first_val = {};
    let second_val = {};
    first_val['Username'] = username;
    second_val['Password'] = password;
    request = Object.assign(first_val, second_val);

    axios
      .post(`http://192.168.29.83:5001/generate-token`, {
        data: request,
      })
      .then(response => {
        if (response.data === 'invalid') {
          this.setState({error: true});
        } else {
          token = response.data.Token;
          Keychain.setGenericPassword(username, password).then(res => {
            this.props.setStatus();
          });
        }
      });
  };

  render() {
    return (
      <View>
        {this.props.loggedInStatus ? (
          <RemotePushController />
        ) : (
          <View style={styles.container}>
            <Text
              style={{alignItems: 'center', fontSize: 30, fontWeight: 'bold'}}>
              Login
            </Text>
            {this.state.error ? (
              <Text style={{color: 'red'}}>username/password is incorrect</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="username"
              type="text"
              onChangeText={evt => this.setState({userName: evt})}
            />
            <TextInput
              style={styles.input}
              placeholder="password"
              secureTextEntry
              onChangeText={evt => this.setState({password: evt})}
            />
            <TouchableOpacity style={styles.btn} onPress={this.handleLDAPLogin}>
              <Text>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    flex: 1,
  },
  input: {
    height: 40,
    width: '70%',
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 2,
    padding: 10,
    margin: 10,
  },
  btn: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: 'grey',
    borderRadius: 30,
  },
});

export default LoginInApp;
