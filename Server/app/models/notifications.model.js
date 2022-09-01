const validator = require('validator');

const NotificationSchema = module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      title: {
        type: String,
      },
      sender_user_id : {
        type: String,
      },
      receiver_user_id : {
        type: String,
      }
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("admin", schema);
};