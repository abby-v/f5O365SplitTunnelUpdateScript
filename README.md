# f5O365SplitTunnelUpdateScript.js

This script is designed to automatically update the network access profile on a F5 BigIP and subsequently apply the related access policy after the updates have been made.

This script is specifically taylored to assist with the O365 Worldwide IP space published by Microsoft in their REST API.  It currenlty only supports IPv4.  Eventually, IPv6. Maybe.


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
  This URL gets a uuid appended, in addition to &NoIPV6 to filter out all IPv6 responses from the JSON.
  https://docs.microsoft.com/en-us/office365/enterprise/office-365-ip-web-service
  */
  "o365addressURL": "https://endpoints.office.com/endpoints/worldwide?clientrequestid=",
  
}
```
Go break stuff. Enjoy!

Original source - https://github.com/bepsoccer/dynamicSplitTunnelList
