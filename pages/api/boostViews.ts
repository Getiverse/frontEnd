import fluentFFmpeg from "fluent-ffmpeg";
import fs from "fs";
import axios from "axios";
// const videoshow = require("videoshow");
const path = require("path");

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const { image_file_path, audio_file_path } = req.body;
    let imageName = image_file_path.split("/")[2];
    let audioName = audio_file_path.split("/")[2];
    let { username } = req.user;
    let cwd = process.cwd();
    fs.readdir(
      path.resolve(cwd, process.env.ROOT_UPLOAD_PATH, username),
      (err, files) => {
        let imageFile = [];
        let audioFile = [];

        imageFile = files.filter((file) => file === imageName);
        audioFile = files.filter((file) => file === audioName);
        if (imageFile.length == 0) {
          return res.json({
            error: "No such image file exist in your storage.",
          });
        } else if (audioFile.length == 0) {
          return res.json({
            error: "No such audio file exist in your storage.",
          });
        }
        // If both img and audio file existing in user storage then merge both the files
        var images = [
          { path: path.resolve(cwd, "public", "audio", "Asad", imageFile[0]) },
        ];

        var videoOptions = {
          fps: 25,
          loop: 20, // seconds
          transition: true,
          // transitionDuration: 5, // seconds
          videoBitrate: 1024,
          videoCodec: "libx264",
          size: "640x?",
          audioBitrate: "128k",
          audioChannels: 2,
          format: "mp4",
          pixelFormat: "yuv420p",
        };
        imageName = imageName.split(".")[0];
        audioName = audioName.split(".")[0];
        const saveFileName = `${imageName}_${audioName}_${Date.now()}.mp4`;
        let saveVideoFilePath = path.resolve(
          cwd,
          "public",
          "audio",
          username,
          saveFileName
        );
        // videoshow(images, videoOptions)
        //   .audio(path.resolve(cwd, "public", "audio", username, audioFile[0]))
        //   .save(saveVideoFilePath)
        //   .on("start", function (command: any) {
        //     // console.log('ffmpeg process started:', command)
        //   })
        //   .on("error", function (err: any, stdout: any, stderr: any) {
        //     return res.json({ error: err, ffmpeg_stderr: stderr });
        //     // console.error('Error:', err)
        //     // console.error('ffmpeg stderr:', stderr)
        //   })
        //   .on("end", function (output:any) {
        //     // console.error('Video created in:', output)
        //     return res.json({
        //       status: "ok",
        //       message: "Video Created Successfully",
        //       video_file_path: `public/assets/audio${username}/${saveFileName}`,
        //     });
        //   });
        // res.send({imageFile,audioFile})
      }
    );
    // res.send({ imageName, audioName })
  }
}
