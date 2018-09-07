"use strict";

var Client = require('node-rest-client').Client;
var includes = require('array-includes');
var cidrClean = require('cidr-clean');

var settings = require('./settings.json');

var options = {
  mimetypes: {
      xml: ["application/xml"]
    }
};
var client = new Client(options);
client.parsers.find("XML").options= {"mergeAttrs": true};

//Call-out to Microsoft and retrieve the O365 XML
client.get(settings.o365addressURL, function (data, response) {
  var newlist = [];
  for(var i = 0; i < data.products.product.length; i++)
  {
    if(includes(settings.msProducts, data.products.product[i].name[0])) {
      for(var ii = 0; ii < data.products.product[i].addresslist.length; ii++) {
        //Collect only the IPv4 addresses for the specified products in the settings
        if(data.products.product[i].addresslist[ii].type[0] == 'IPv4') {
          if ( typeof data.products.product[i].addresslist[ii].address !== 'undefined' && data.products.product[i].addresslist[ii].address ) {
            var addresslist = data.products.product[i].addresslist[ii].address
            addresslist.forEach(function(value) {
              newlist.push(value);
            });
          }
        }
      }
    }
  }
  //Clean-up the IPv4 addresses - Remove duplicates and supernet matching subnets
  if (newlist.length) {
    var newlist = cidrClean(newlist);
    var addresses = [];
    newlist.forEach(function(value) {
      var tempobj = {'subnet': value};
      addresses.push(tempobj);
    });
    /*Specify which list will be updated in the Network Access policy - addressSpaceExcludeSubnet
    Anything in this list will NOT be forced through the VPN tunnel and will be split-tunneled
    Out to the internet directly from the client's machine*/
    var body = {'addressSpaceExcludeSubnet': addresses};
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