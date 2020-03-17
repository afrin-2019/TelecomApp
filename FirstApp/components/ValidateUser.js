import React, {Component, useState} from 'react';
import {View, Text} from 'react-native';
import axios from 'axios';

export async function validateUser(username, password) {
  //const [returnValue, setValue] = useState();
  let request = {};
  let first_val = {};
  let second_val = {};
  let return_val = {};
  //console.log(props.username + ' ' + props.password);
  first_val['Username'] = username;
  second_val['Password'] = password;
  request = Object.assign(first_val, second_val);

  await axios
    .post(`http://192.168.17.3:5001/generate-token`, {
      data: request,
    })
    .then(res => {
      console.log('res', res.data);
      // setValue(res.data);
      return_val = res.data;
    });
  return return_val;
}
