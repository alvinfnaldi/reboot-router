# Reboot Your 4G Router/Modem Automatically Using Puppeteer

The device I use : Router Tenda 4G06<br/>
The reason I created this : Too tired restarting using GUI until it finds the second octet of WAN IP Address is greater than 130 (for some reason)<br/>

Puppeteer will : Open a homepage --> typing password --> login --> checking ip address --> if second octet of ip less than 130 --> go to system settings --> click reboot & reset menu --> click reboot

<h3>Usage : </h3>
<ol>
  <li>Clone this repo</li>
  <li>Open it with your IDE</li>
  <li>Open terminal & type "npm install"</li>
  <li>Customize your preferences URL Link or IP Address of your own Router/Modem</li>
</ol>
