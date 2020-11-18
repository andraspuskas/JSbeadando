const socket = new WebSocket('ws://localhost:3000');
var filterButton = document.getElementById("filterButton").addEventListener("click", switchFilter);
var filter = 0;
var zoom = 10;

// Connection opened
socket.addEventListener('open', function (event) {
    console.log('Connected to WS Server')
});

// Listen for messages
socket.addEventListener('message', function (event) {
    if (event.data.toString().length > 100) {
        refreshImage(event.data);
    }
});

function switchFilter(){
    if (filter == 2){
        filter = 0;
    }
    else {
        filter++;
    }
}

function jsonToArray(inputJSON){
    var dataArray = [];
    inputJSON.forEach(function (item){
        dataArray.push(item);
    });
    return dataArray;
}

function lampFilter(invertedFrame){



    var extendedFrame = [];

    for (let i = 0; i < 64*zoom; i++) {
        for (let j = 0; j < 64*zoom; j++) {
            extendedFrame.push(3);
        }
    }

    for (let i = 0; i < 64; i++) {
        for (let j = 0; j < 64; j++) {
            for (let k = 0; k < zoom; k++) {
                for (let l = 0; l < zoom; l++) {
                    switch (filter){
                        case 0:
                            extendedFrame[zoom*zoom*i*64+zoom*j+zoom*k*64+l] = invertedFrame[i*64+j];
                            break;
                        case 1:
                            if ((((k === 0) || (k === 9)) || ((l === 0) || (l === 9))) ||
                                (((k === 1) || (k === 8)) && ((l !== 4) && (l !== 5))) ||
                                (((l === 1) || (l === 8)) && ((k !== 4) && (k !== 5)))){
                                extendedFrame[zoom*zoom*i*64+zoom*j+zoom*k*64+l] = 3;
                            }
                            else {
                                extendedFrame[zoom*zoom*i*64+zoom*j+zoom*k*64+l] = invertedFrame[i*64+j];
                            }
                            break;
                        case 2:
                            if ((((k === 0) || (k === 9)) || ((l === 0) || (l === 9)))){
                                extendedFrame[zoom*zoom*i*64+zoom*j+zoom*k*64+l] = 3;
                            }
                            else {
                                extendedFrame[zoom*zoom*i*64+zoom*j+zoom*k*64+l] = invertedFrame[i*64+j];
                            }
                            break;
                    }
                }
            }
        }
    }

    return extendedFrame;
}

function refreshImage(rawFrameString){
    var rawJSONFrame = JSON.parse(rawFrameString);
    var rawFrame = jsonToArray(rawJSONFrame);
    rawFrame = lampFilter(rawFrame);

    var ind = 0;
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var imgData = ctx.createImageData(640, 640);
    rawFrame.forEach(function (item){
        switch (Number(item)){
            case 0:
                imgData.data[ind + 0] = 80;
                imgData.data[ind + 1] = 91;
                imgData.data[ind + 2] = 87;
                break;
            case 1:
                imgData.data[ind + 0] = 242;
                imgData.data[ind + 1] = 3;
                imgData.data[ind + 2] = 0;
                break;
            case 2:
                imgData.data[ind + 0] = 201;
                imgData.data[ind + 1] = 16;
                imgData.data[ind + 2] = 16;
                break;
            case 3:
                imgData.data[ind + 0] = 30;
                imgData.data[ind + 1] = 30;
                imgData.data[ind + 2] = 30;
                break;
        }
        imgData.data[ind + 3] = 255;
        ind += 4;
    });
    ctx.putImageData(imgData, 0, 0);
}
