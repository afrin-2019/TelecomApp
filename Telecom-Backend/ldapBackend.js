var ldap = require("ldapjs");

const ldapOptions = {
  url: "ldap://localhost:10389"
};

const ldapClient = ldap.createClient(ldapOptions);

ldapClient.bind("uid=admin,ou=system", "wisdom", function(err) {
  if (err) throw err;

  //authenticate a user

  ldapClient.bind("userid=ram,ou=users,o=Wisdom", "ram", function(err) {
    if (err) throw err;

    ldapClient.unbind();
    console.log("successful authentication");
  });

  //search entry
  ldapClient.search("userid=ram,ou=users,o=Wisdom", function(err, res) {
    if (err) throw err;

    res.on("searchEntry", function(entry) {
      console.log("entry: " + JSON.stringify(entry.object));
    });
    res.on("error", function(err) {
      console.error("error: " + err.message);
    });
    res.on("end", function(result) {
      console.log("status: " + result.status);
    });
  });

  //add entry

  //   var entry = {
  //     cn: "raj",
  //     sn: "singh",
  //     userPassword: "raj",
  //     objectclass: ["top", "person", "organizationalPerson", "inetOrgPerson"]
  //   };
  //   ldapClient.add("userid=raj,ou=users,o=Wisdom", entry, function(err) {
  //     if (err) throw err;
  //     console.log("added successfully");
  //   });
});
