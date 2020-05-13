// /sponsors
import express from 'express';
import * as sponsorsController from '../controllers/sponsors.controller';
import multer from 'multer';
const uploadSponsor = multer({ dest: './uploads/sponsors' });
import Logs from '../models/Log.model';
import fs from 'fs';

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

let SponsorRouter = express.Router();

SponsorRouter.post('/create', sponsorsController.sponsors_create);
SponsorRouter.get('/:id', sponsorsController.sponsors_details);
SponsorRouter.get('/', sponsorsController.sponsors_list);
SponsorRouter.post('/:id/update', sponsorsController.sponsors_update);
SponsorRouter.post('/:id/delete', sponsorsController.sponsors_delete);


SponsorRouter.post('/upload', uploadSponsor.single('sponsorImg'), (req: any, res) => {
    if (req.file) {
      console.log('Uploading file...');
      fs.rename('uploads/sponsors/' + req.file.filename, process.env.IMAGES_FOLDER + '/sponsors/' + req.file.originalname, function (err) {
        if (err) console.log('ERROR: ' + err);
      });
      var filename = req.file.originalname;
      let logs = new Logs(
        {
          time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
          name: req.user.name,
          action: "uploaded sponsor image",
          field: "Image name: " + filename,
        }
      );
      logs.save(function (err, next) {
        if (err) {
          return next(err);
        }
      });
      req.flash('success', { msg: `Sponsor Image Uploaded! Name of File: ${filename}` });
      return res.redirect('/crud');
    } else {
      console.log('No File Uploaded');
      filename = 'FILE NOT UPLOADED';
      req.flash('success', { msg: `Sponsor image upload failed!` });
      return res.redirect('/crud');
    }
  });

export default SponsorRouter;