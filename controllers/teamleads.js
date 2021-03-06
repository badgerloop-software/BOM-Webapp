const teamleads = require('../models/teamlead');
const Teamleads = require('../models/teamlead');
const Logs = require('../models/log');

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

exports.teamleads_create = function (req, res) {
    let teamleads = new Teamleads(
        {
            Team: req.body.Team,
            Position: req.body.Position,
            Name: req.body.Name,
            Major: req.body.Major,
            Year: req.body.Year,
            Picture: req.body.Picture,
        }
    );

    let logs = new Logs(
        {
            time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            name: req.user.name,
            action: "create teamlead",
            field: "Teamlead Name: " + req.body.Name,
        }
    );

    teamleads.save(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', { msg: `Teamlead created successfully!` });
        return res.redirect('/crud');
    });
    logs.save(function (err) {
        if (err) {
            return next(err);
        }
    });
};

exports.teamleads_details = function (req, res) {
    teamleads.findById(req.params.id, function (err, teamleads) {
        if (err) return next(err);
        res.send(teamleads);
    });
};

exports.teamleads_list = function (req, res) {
    teamleads.find(function (err, teamleads) {
        if (err) {
            console.log(err);
        } else {
            res.json(teamleads);
        }
    });
};

exports.teamleads_update = function (req, res) {
    let logs = new Logs(
        {
            time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
            name: req.user.name,
            action: "edit teamlead",
            field: "Teamlead Name: " + req.body.Name,
        }
    );
    teamleads.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, teamleads) {
        if (err) return next(err);
        req.flash('success', { msg: `Teamlead updated successfully!` });
        return res.redirect('/crud');
    });
    logs.save(function (err) {
        if (err) {
            return next(err);
        }
    });
};

exports.teamleads_delete = function (req, res) {
    teamleads.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        let logs = new Logs(
            {
                time: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds,
                name: req.user.name,
                action: "delete teamlead",
                field: "Teamlead Name: " + req.body.Name,
            }
        );
        logs.save(function (err) {
            if (err) {
                return next(err);
            }
        });
        req.flash('success', { msg: `Teamlead deleted successfully!` });
        return res.redirect('/crud');
    });
};