var http = require('http');
const faceapi = require("face-api.js");
import { canvas, faceDetectionNet, faceDetectionOptions, saveFile } from './commons';

var fs = require('fs');

function base64Encode(file: any) {
    var body = fs.readFileSync(file);
    return body.toString('base64');
}

//create a server object:
http.createServer(async function (req: any, res: any) {
    var request = req;

    let body = '';
    req.on('data', (chunk: any) => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {


        var obj = JSON.parse(body);
        for (var key in obj) {
            console.log(key);
        }

        fs.writeFile('out/nice_image.png', obj.photo, { encoding: 'base64' }, async function (err: any) {
            await run();

            var base64String = base64Encode('out/faceDetection.jpg');


            res.end(JSON.stringify(
                {
                    "data": {
                        "result": base64String
                    }
                }
            ));
        });


    });

    return;

    await run();


    var base64String = base64Encode('out/faceDetection.jpg');
    console.log(base64String);

    res.write(base64String); //write a response to the client
    res.end(); //end the response
}).listen(8080);


async function run() {

    await faceDetectionNet.loadFromDisk('../../weights')

    const img = await canvas.loadImage('out/nice_image.png')
    const detections = await faceapi.detectAllFaces(img, faceDetectionOptions)

    const out = faceapi.createCanvasFromMedia(img) as any
    faceapi.draw.drawDetections(out, detections)


    saveFile('faceDetection.jpg', out.toBuffer('image/jpeg'))
    console.log('done, saved results to out/faceDetection.jpg')
}