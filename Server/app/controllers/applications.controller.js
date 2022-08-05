const mongoose = require("mongoose");

const db = require("../models");
const Applications = db['applications'];
const Jobs = db['jobs'];

exports.countApplications = async (req, res) => {
    try {
        var condition = {};
        if(req.params.status > 0) {
            condition.status = req.params.status;
        }
        if (req.user.user_type == 1) {
            condition.applied_by_user_id = req.user.id
        } else {
            condition.posted_by_user_id = req.user.id
        }
        const data = await Applications.find(condition).count();
        res.send({
            count: data
        });
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};

exports.createApplications = async (req, res) => {
    try {

        if (req.user.user_type == 2) {
            res.status(400).send({
                message: "Your don't have permission for apply the job."
            });
            return;
        }

        if (!req.body.job_id) {
            res.status(400).send({
                message: "job_id is required."
            });
            return;
        }

        const job_data = await Jobs.findById(req.body.job_id);
        if (!job_data) {
            res.status(400).send({
                message: `Job not found.`
            });
            return;
        }

        var condition = {
            job_id: req.body.job_id,
            applied_by_user_id: req.user.id
        };

        const application_data = await Applications.findOne(condition);

        if (application_data) {
            res.status(400).send({
                message: `Your already applied to this Job.`
            });
            return;
        }

        const ObjectId = mongoose.Types.ObjectId;
        let posted_by_user_id = ObjectId(job_data.user_id);
        let applied_by_user_id = ObjectId(req.user.id);
        let job_id = ObjectId(req.body.job_id);

        req.body.posted_by_user_id = posted_by_user_id;
        req.body.applied_by_user_id = applied_by_user_id;
        req.body.job_id = job_id;

        const applications = new Applications(req.body);
        const data = await applications.save(applications);
        res.status(201).send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};

exports.findApplications = async (req, res) => {
    try {
        const ObjectId = mongoose.Types.ObjectId;

        let aggre = [
            // {
            //     $lookup: {
            //         from: 'users',
            //         localField: 'posted_by_user_id',
            //         foreignField: '_id',
            //         as: 'users'
            //     }
            // },
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'job_id',
                    foreignField: '_id',
                    as: 'jobs'
                }
            }
        ];

        if (req.user.user_type == 1) {
            if (req.params.status) {
                aggre.push({
                    $match: {
                        applied_by_user_id: ObjectId(req.user.id),
                        status: parseInt(req.params.status)
                    }
                });
            } else {
                aggre.push({
                    $match: {
                        applied_by_user_id: ObjectId(req.user.id),
                    }
                });
            }
        } else {
            if (req.params.status) {
                aggre.push({
                    $match: {
                        posted_by_user_id: ObjectId(req.user.id),
                        status: parseInt(req.params.status)
                    }
                });
            } else {
                aggre.push({
                    $match: {
                        posted_by_user_id: ObjectId(req.user.id),
                    }
                });
            }
        }

        const data = await Applications.aggregate(aggre);
        if (!data) {
            res.status(400).send({
                message: `No application has been found.`
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