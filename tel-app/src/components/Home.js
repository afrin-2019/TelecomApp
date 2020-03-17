import React, { Component } from "react";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      notificationData: ""
    };
  }

  componentDidMount() {
    var username = this.getUrlVars()["param"];
    var data = this.getUrlVars()["data"];
    this.setState({ user: username });
    this.setState({ notificationData: data });
  }
  getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function(m, key, value) {
        vars[key] = value;
      }
    );
    return vars;
  }

  setToken = token => {
    this.setState({ token: token });
  };
  render() {
    return (
      <div className="container">
        <h1>Welcome {this.state.user}</h1>

        <a href="app://ReactNativeMaps">
          <button className="btn btn-primary" style={{ margin: 10 }}>
            Open my app
          </button>
        </a>
        <p>
          {" "}
          <b> {this.state.notificationData}</b>
        </p>
      </div>
    );
  }
}

export default Home;
