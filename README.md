# f5O365SplitTunnelUpdateScript.js

This script is designed to automatically update the Network Access Policy on a F5 BigIP and subsequently apply the policy after the updates have been made.

This script is specifically taylored to assist with the O365 Worldwide IP space published by Microsoft in their XML file.  It currenlty only supports IPv4.  Eventually, IPv6. Maybe.


# Example: settings.json

**Note**:
When modifying the .json settings file, you cannot use comments of any kind.  Hence, the example file below is only a reference and cannot be used directly.

```js

{
  "name": "splittuneel-settings",
  
  //Naming scheme is ~<Partition Name>~<Network Access Profile Name>
  "networkAccessObject": "~Common~network_acess_na",
  
  //Naming scheme is ~<Partition Name>~<Access Policy Name>
  "accessPolicyObject": "~Common~access_policy_ap",
  
  //IP addresses are used, not hostnames
  "ipAddressOfBigIP": "10.10.10.10",
  
  //Username and password of an account with admin access on aformentioned BigIP address
  "userName": "admin",
  "password": "admin",
  
  /*URL of the Microsoft published O365 list. More info here: 
  https://docs.microsoft.com/en-us/office365/enterprise/urls-and-ip-address-ranges
  */
  "o365addressURL": "https://support.content.office.net/en-us/static/O365IPAddresses.xml",
  
  /*Specific products can be configured to shorten the ammount of IP addressed in the Network Access profile
  Having many hundred IP address in the profile can start to slow-down the Edge client connection initiation time.
  For each 500 IP addresses, the connection initiation time slows down by ~2 seconds while the endpoint
  applies the additional routes into the routing table. The delay is host dependent.  Fewer products = fewer IPs = 
  fewer routes = faster connection iniation.  We are currently targeting ALL applications, however.*/
  "msProducts": ["o365",
    "LYO",
    "Planner",
    "Teams",
    "ProPlus",
    "OneNote",
    "Yammer",
    "EXO",
    "Identity",
    "Office365Video",
    "WAC",
    "SPO",
    "RCA",
    "Sway",
    "EX-Fed",
    "OfficeMobile",
    "CRLs",
    "OfficeiPad",
    "EOP"
  ],
  
  "state": "TEMPLATE", //Do NOT remove this line.  It's required for .json template files such as this.
}
```
Go break stuff. Enjoy!

Original source - https://github.com/bepsoccer/dynamicSplitTunnelList
