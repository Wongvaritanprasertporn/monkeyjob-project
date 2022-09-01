const validator = require('validator');

const MessagesSchema = module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      from_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'required'],
      },
      to_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'required'],
      },
      message: {
        type: String,
        required: [true, 'required']
      }
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("messages", schema);
};