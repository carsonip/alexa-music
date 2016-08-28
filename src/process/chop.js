import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import AWS from 'aws-sdk';

export default function chop(filename, tempo, beats, measureCnt) {
  var manifest = {};

  var timestamp = Math.floor(new Date() / 1000);

  var s3 = new AWS.S3();
  s3.createBucket({Bucket: 'alexa-music'}, function () {
    for (var i = 0, len = measureCnt; i < len; i++) {
      var id = `${timestamp}-${i}-${i + 1}`;
      var out = `/tmp/${id}.mp3`;

      var start = i * (beats / tempo) * 60, duration = (beats / tempo) * 60;
      ffmpeg(`assets/${filename}`)
        .inputOptions([
        `-ss ${start}`,
        `-t ${duration}`
      ])
        .output(out)
        .on('end', ((id, out) => {return () => {
          var params = {Bucket: 'alexa-music', Key: id, Body: fs.createReadStream(out), ACL: 'public-read'};
          s3.putObject(params, function (err, data) {
            if (err) console.log(err);
            else console.log(`Successfully uploaded data to s3 ${id}`);
          });
        }})(id, out))
        .run();
    }
  });

  return manifest;
}