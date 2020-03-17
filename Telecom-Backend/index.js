const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const passport = require("passport");
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const jwt = require("jsonwebtoken");
var ldap = require("ldapjs");
var FCM = require("fcm-node");
var serverKey =
  "AAAAnmofICg:APA91bE3jBjuOvnvFEHY1jKe_Gevr_uwr6lfwrHcr3Sopb4h1_qUYcRIknardz3nYDcVq8Tlc9JWYESPHRYNC2zbvxxx3sZkGaiWv9ASFflcP-wFCkYUTPWlm6aOC6lkC-Ds92n_dPC7"; // put your server key here
var fcm = new FCM(serverKey);

const ldapOptions = {
  url: "ldap://localhost:10389"
};

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_OR_KEY
};

const strategy = new JwtStrategy(opts, (payload, next) => {
  const user = null;
  next(null, user);
});
passport.use(strategy);
app.use(passport.initialize());

var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/TelecomDatabase";

MongoClient.connect(url, function(err, db) {
  var dbo = db.db("TelecomDatabase");
  if (err) throw err;
  console.log("connected");

  //validate user when connected through mongodb
  app.get("/validate/user", (req, res) => {
    var userName = req.query.Username;
    var password = req.query.Password;
    dbo
      .collection("UserDetails")
      .find({ Username: userName, Password: password })
      .toArray(function(err, user) {
        if (err) throw err;
        if (user.length == 0) {
          res.send("invalid");
        } else {
          res.send("valid");
        }
      });
  });

  //validate user when connected through LDAP Server
  app.get("/validate/ldap_user", (req, res) => {
    var userName = req.query.Username;
    var password = req.query.Password;
    const ldapClient = ldap.createClient(ldapOptions);
    ldapClient.bind(
      "userid=" + userName + ",ou=users,o=Wisdom",
      password,
      function(err) {
        if (err) {
          res.send("invalid");
        } else {
          res.send("valid");
        }
      }
    );
  });

  //storing of userid and token into mongodb collection

  app.post("/store_token", (req, res) => {
    var userid = req.body.data.userid;
    var token = req.body.data.token;
    dbo
      .collection("Tokencollection")
      .insertOne({ Username: userid, Token: token }, function(err, res) {
        if (err) throw err;
      });
    res.send("token inserted");
  });

  //generate token if user credentials are validated
  app.post("/generate-token", (req, res) => {
    var userName = req.body.data.Username;
    var password = req.body.data.Password;
    dbo
      .collection("UserDetails")
      .find({ Username: userName, Password: password })
      .toArray(function(err, user) {
        if (err) throw err;
        if (user.length == 0) {
          res.send("invalid");
        } else {
          const payload = { id: userName };
          const token = jwt.sign(payload, process.env.SECRET_OR_KEY);
          dbo
            .collection("Tokencollection")
            .insertOne({ Username: userName, Token: token }, function(
              err,
              res
            ) {
              if (err) throw err;
            });
          res.send({ Token: token });
        }
      });
  });

  // --------------------------------------
  //          LDAP CLIENT
  // ---------------------------------------

  app.get("/ldap/authenticate", (req, res) => {
    var userName = req.query.Username;
    var password = req.query.Password;
    const ldapClient = ldap.createClient(ldapOptions);

    ldapClient.bind("uid=admin,ou=system", "wisdom", function(err) {
      if (err) throw err;

      //authenticate a user

      ldapClient.bind(
        "userid=" + userName + ",ou=users,o=Wisdom",
        password,
        function(err) {
          if (err) {
            res.send("invalid");
          } else {
            const payload = { id: userName };
            const token = jwt.sign(payload, process.env.SECRET_OR_KEY);
            dbo
              .collection("Tokencollection")
              .insertOne({ Username: userName, Token: token }, function(
                err,
                res
              ) {
                if (err) throw err;
              });
            res.send({ Token: token });
          }
        }
      );
    });
  });

  //store firebase token for device in mongodb
  app.post("/store-device-token", (req, res) => {
    var user = req.body.data.user;
    var deviceToken = req.body.data.deviceToken.token;
    dbo
      .collection("DeviceToken")
      .insertOne({ User: user, DeviceToken: deviceToken }, function(err, res) {
        if (err) throw err;
      });
    res.send("Inserted in DeviceToken collection");
  });
});

app.post("/push-notification", (req, res) => {
  var title = req.body.title;
  var notification_body = req.body.message;

  var message = {
    //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to:
      "dt42cN9FPzg:APA91bH-84npSww1klG-8xqMa4sICTiFuUZfvblg4vZGwdEGO3eBU27pK7c4w7MrCV63lekST3dO4ymMEKKx8MvoAulUTxqwM_tCv3yPfEqAed2WVS3a_27DmIQiu75q7UqcJNjD0mHs",
    //collapse_key: 'your_collapse_key',

    notification: {
      title: title,
      body: notification_body
    },

    data: {
      //you can send only notification or only data(or include both)
      test: "Notification_Data"
      //my_key: "my value"
      // my_another_key: "my another value"
    }
  };

  fcm.send(message, function(err, response) {
    if (err) {
      console.log("Something has gone wrong!");
      res.send(err);
    } else {
      console.log("Successfully sent with response: ", response);
      res.send("success");
    }
  });
});
app.listen(5001);
