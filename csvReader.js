const fs = require('fs');
const csv = require('csv-parser');

const dtlData = [];

function init() {
    fs.createReadStream('dtl.csv').pipe(csv(['FrameData'])).on('data', (data) => dtlData.push(data));
}

function getFrame(index, zoom){
    var rawFrame = dtlData[index].FrameData;
    var splitedFrame = rawFrame.toString().split(';');
    splitedFrame.pop()
    var invertedFrame = [];
    for (let i = 0; i < 64; i++){
        for (let j = 0; j < 64; j++){
            invertedFrame.push(splitedFrame[64*64-1-64*i+j]);
        }
    }
    return invertedFrame;
}

function getFrameCount(){
    return dtlData.length;
}

module.exports = {
    init,
    getFrame,
    getFrameCount
}
