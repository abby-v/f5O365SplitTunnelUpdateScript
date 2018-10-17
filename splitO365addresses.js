"use strict";
var Client = require('node-rest-client').Client;
var uuidv1 = require('uuid/v1');

var settings = require('./settings.json');

var options = {
  mimetypes: {
      xml: ["application/json"]
    }
};
var client = new Client(options);
var url = settings.o365addressURL + uuidv1() + "&NoIPV6";

//Call-out to Microsoft and retrieve the O365 JSON
client.get(url, function (data, response) {
  var newlist = [];

  //first foreach drops to element level, we will look for IP block next.
  data.forEach(element => {
    for(var ip in element.ips){
      //push to stack
      newlist.push({'subnet': element.ips[ip]});
    }
  });

  if (newlist.length) {
    /*Specify which list will be updated in the Network Access policy - addressSpaceExcludeSubnet
    Anything in this list will NOT be forced through the VPN tunnel and will be split-tunneled
    Out to the internet directly from the client's machine*/
    var body = {'addressSpaceExcludeSubnet': newlist};
    var client = new Client(options_auth);
    //Values for the Network Access Profile update
    var args_na = {
      data: body,
      headers: {"Content-Type": "application/json"},
      path: {"NA": settings.networkAccessObject},
    };
    //Values to apply Access Policy
    var args_ap = {
      data: { "generationAction": "increment" },
      headers: {"Content-Type": "application/json"},
      path: {"AP": settings.accessPolicyObject}
    };
    //Values for username and password of an admin account on the BigIP
    var options_auth = {
      user: (settings.userName),
      password: (settings.password),
      connection: {
      "rejectUnauthorized": false 
      }
    };
    var client = new Client(options_auth);
    //Apply the 'addresses' list to the F5 APM Network Access profile.
    client.patch("https://"+(settings.ipAddressOfBigIP)+"/mgmt/tm/apm/resource/network-access/${NA}", args_na, function (data, response) {
      console.log(data);
    });
    /*Need to wait until the upload of the new addresses is complete 
    before applying the Access Policy. Roughly 8 seconds seems to do the trick.
    It's not exactly 8 seconds. This can be adjusted if there is a command 
    collision in the future; the longer you can live with, the better.*/
    setTimeout(function(){
        client.patch("https://"+(settings.ipAddressOfBigIP)+"/mgmt/tm/apm/profile/access/${AP}", args_ap, function (data, response) {
        console.log(data);
        });
      }, 8000);
  }
});