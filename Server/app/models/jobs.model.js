const validator = require('validator');

const JobsSchema = module.exports = mongoose => {
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
      email: {
        type: String,
        required: [true, 'required'],
      },
      minimum_age: {
        type: String,
        required: [true, 'required'],
      },
      maximum_age: {
        type: String,
        required: [true, 'required'],
      },
      type: {
        type: String,
        enum: ['Full Time', 'Part Time'],
        required: [true, 'required'],
      },
      salary: {
        type: String,
        required: [true, 'required'],
      },
      city: {
        type: String,
        required: [true, 'required'],
      },
      description: {
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

  return mongoose.model("jobs", schema);
};