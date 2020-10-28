console.log("HELLO")
const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI('T6X4XL-RXUGV2XRUP');

waApi.get('where is the ISS?').then(console.log).catch(console.error);