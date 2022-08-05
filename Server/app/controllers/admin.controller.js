const db = require("../models");

const User = db["users"];
const Jobs = db['jobs'];

exports.countJobs = async (req, res) => {
    try {
        var condition = {};
        const data = await Jobs.find(condition).count();
        res.send({
            count: data
        });
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};

exports.countUsers = async (req, res) => {
  try {
      var condition = {
        is_active : 1
      };
      const data = await User.find(condition).count();
      res.send({
          count: data
      });
  } catch (error) {
      res.status(500).send({
          message: error.message
      });
  }
};

exports.findsUsers = (req, res) => {
  try {
    var condition = {
      user_type : req.params.user_type
    };
    if (req.query.type) {
      condition.type = req.query.type.split(",");
    }
    var offset = parseInt(req.query.offset);
    var limit = parseInt(req.query.limit);

    if (limit > -1 && offset > -1) {
      User.find(condition)
        .skip(offset).limit(limit)
        .then(data => {
          res.send(data);
        })
        .catch(error => {
          res.status(500).send({
            message:
              error.message || "Some error occurred while retrieving db[req.params.document]."
          });
        });
    } else {
      User.find(condition)
        .then(data => {
          res.send(data);
        })
        .catch(error => {
          res.status(500).send({
            message:
              error.message || "Some error occurred while retrieving db[req.params.document]."
          });
        });
    }

  } catch (error) {
    res
      .status(500)
      .send(
        {
          message: "Wrong document or schema"
        }
      );
  }
};