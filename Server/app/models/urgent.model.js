const validator = require('validator');

const UrgentSchema = module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'required'],
      },
      title: {
        type: String,
        required: [true, 'required'],
      },
      bound: {
        type: String,
        required: [true, 'required'],
      },
      description: {
        type: String,
        required: [true, 'required'],
      },
      banner: {
        type: String,
        required: [true, 'required'],
      },
      status: {
        type: Number,
        default: 1,
        required: [true, 'required'],
      }
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("urgent", schema);
};