const validator = require('validator');

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      job_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'required'],
      },
      posted_by_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'required'],
      },
      applied_by_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'required'],
      },
      status: {
        type: Number,
        default: 1, // 2 - Shortlist, 3 - Rejected
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

  return mongoose.model("applications", schema);
};