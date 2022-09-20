const mongoose = require("mongoose");

const db = require("../models");
const Banner = db.banner;

exports.countBanner = async (req, res) => {
    try {
        var condition = {
            user_id: req.user.id
        };
        const data = await Banner.find(condition).count();
        res.send({
            count: data
        });
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
}

exports.createBanner = async (req, res) => {
    try {

        if (req.user.user_type == 1) {
            res.status(400).send({
                message: "Your don't have permission for post the job."
            });
            return;
        }

        const ObjectId = mongoose.Types.ObjectId;
        let user_id = ObjectId(req.user.id);
        req.body.user_id = user_id;
        const jobs = new Banner(req.body);
        const data = await jobs.save(jobs);
        res.status(201).send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};

exports.findBanner = async (req, res) => {
    try {
        const ObjectId = mongoose.Types.ObjectId;
        const data = await Banner.aggregate([{
            $lookup: {
                from: 'banner',
                localField: 'user_id',
                foreignField: '_id',
                as: 'banner'
            }
        },
        {
            $match: {
                user_id: ObjectId(req.user.id)
            }
        }
        ]).sort({ updatedAt: -1 });
        if (!data) {
            res.status(400).send({
                message: `No data`
            });
        } else {
            res.send(data);
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};