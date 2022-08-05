const mongoose = require("mongoose");

const db = require("../models");
const Messages = db['messages'];
const Conversation = db['conversation'];

exports.countMyMessage = async (req, res) => {
    try {
        var condition = {
            to_user_id : req.user.id
        };
        const data = await Messages.find(condition).count();
        res.send({
            count: data
        });
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};

exports.createMessage = async (req, res) => {
    try {
        const ObjectId = mongoose.Types.ObjectId;
        let from_user_id = ObjectId(req.user.id);
        req.body.to_user_id = ObjectId(req.body.to_user_id);
        req.body.from_user_id = from_user_id;

        var condition = {
            from_user_id: from_user_id,
            to_user_id: req.body.to_user_id
        };
        const conversation_data = await Conversation.findOne(condition);
        if (!conversation_data) {
            const conversation = new Conversation(condition);
            await conversation.save(conversation);
        }   else {
            await Conversation.findByIdAndUpdate(conversation_data.id, {
                message: req.body.message
            }, {
                useFindAndModify: false,
                runValidators: true
            });
        }

        var condition2 = {
            from_user_id: req.body.to_user_id,
            to_user_id: from_user_id
        };

        const conversation_data2 = await Conversation.findOne(condition2);
        if (!conversation_data2) {
            const conversation = new Conversation(condition2);
            await conversation.save(conversation);
        }   else {
            await Conversation.findByIdAndUpdate(conversation_data2.id, {
                message: req.body.message
            }, {
                useFindAndModify: false,
                runValidators: true
            });
        }

        const messages = new Messages(req.body);
        const data = await messages.save(messages);
        res.status(201).send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};

exports.findMessages = async (req, res) => {
    try {
        const data = await Messages.find(
            {
                $or:
                    [
                        {
                            from_user_id: req.query.from_user_id,
                            to_user_id: req.query.to_user_id
                        },
                        {
                            from_user_id: req.query.to_user_id,
                            to_user_id: req.query.from_user_id
                        }
                    ]
            }).sort([['_id', -1]]).skip(0).limit(10);

        res.send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};

exports.findConversation = async (req, res) => {
    try {
        const ObjectId = mongoose.Types.ObjectId;
        const data = await Conversation.aggregate([{
            $lookup: {
                from: 'users',
                localField: 'to_user_id',
                foreignField: '_id',
                as: 'users'
            }
        },
        {
            $match: {
                from_user_id: ObjectId(req.user.id)
            }
        },
        { $sort: { updatedAt: -1 } },
        ]);
        res.send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
};