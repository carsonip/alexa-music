import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import AWS from 'aws-sdk';

export default function chop(filename, tempo, beats, measureCnt) {
  var timestamp = Math.floor(new Date() / 1000);

  var s3 = new AWS.S3();
  s3.createBucket({Bucket: 'alexa-music'}, function () {
    var id = `${timestamp}`;
    var out = `/tmp/${id}.mp3`;
    ffmpeg(`assets/${filename}`)
      .output(out)
      .on('end', ((id, out) => {return () => {
        var params = {Bucket: 'alexa-music', Key: id, Body: fs.createReadStream(out), ACL: 'public-read'};
        s3.putObject(params, function (err, data) {
          if (err) console.log(err);
          else console.log(`Successfully uploaded data to s3 ${id}`);
        });
      }})(id, out))
      .run();
    for (var step = 1; step <= 2; step++){
      for (var i = 0, len = measureCnt; i + step <= len; i++) {
        for (var newTempo=0.5;newTempo<=1;newTempo+=0.5){

          var id = `${timestamp}-${i}-${i + step}-s`;
          var out = `/tmp/${id}.mp3`;

          var start = i * (beats / tempo) * 60, duration = (beats / tempo) * 60;
          ffmpeg(`assets/${filename}`)
            .inputOptions([
              `-ss ${start}`,
              `-t ${duration}`
            ])
            .audioFilters(
              {
                filter: 'atempo',
                options: '0.5'
              }
            )
            .output(out)
            .on('end', ((id, out) => {return () => {
              var params = {Bucket: 'alexa-music', Key: `${id}.mp3`, Body: fs.createReadStream(out), ACL: 'public-read'};
              s3.putObject(params, function (err, data) {
                if (err) console.log(err);
                else console.log(`Successfully uploaded data to s3 ${id}`);
              });
            }})(id, out))
            .run();
        }

      }
    }
  });

  return {
    baseUrl: "https://s3.amazonaws.com/alexa-music/",
    baseId: '' + timestamp,
    measureCnt: measureCnt
  };
}