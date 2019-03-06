require('libs/weapp-adapter/index');
var Parser = require('libs/xmldom/dom-parser');
window.DOMParser = Parser.DOMParser;
require('libs/wx-downloader.js');
wxDownloader.REMOTE_SERVER_ROOT = "https://imgs.matchvs.com/static/tianziyou/jumpjump";
wxDownloader.SUBCONTEXT_ROOT = "";
require('src/settings.537f1');
require('main.50a4d');