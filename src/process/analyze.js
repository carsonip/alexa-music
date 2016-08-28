import fs from 'fs'
var DOMParser = require('xmldom').DOMParser;

export default (filename) => {
  var data = fs.readFileSync(`assets/${filename}`, 'utf-8');
  var beats,
    measure,
    tempo,
    doc;
  doc = new DOMParser().parseFromString(data, 'application/xml');
  beats = doc.getElementsByTagName('beats')[0]['firstChild']['data'];
  measure = doc.getElementsByTagName('measure')['$$length'];
  tempo = doc.getElementsByTagName('sound')[0];
  tempo = tempo.getAttributeNode("tempo")['nodeValue'];
  return {
    beats: parseInt(beats),
    measureNumber: parseInt(measure),
    tempo: parseFloat(tempo)
  }
}