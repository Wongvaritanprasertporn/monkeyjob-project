const validator = require('validator');

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      name: {
        type: String,
      },
      email: {
        type: String,
        lowercase: true,
        validate: {
          validator: validator.isEmail,
          message: '{VALUE} is not a valid email',
          isAsync: false
        }
      },
      password: {
        type: String
      },
      company: {
        type: String,
      },
      phone: {
        type: String,
      },
      is_active: {
        type: Number,
        enum: [1, 0],
        default: 1,
        required: [true, 'required'],
      },
      login_method: {
        type: String,
        enum: ['Email', 'Phone', 'Google', 'Apple'],
        required: [true, 'required'],
      },
      is_2factor_auth_enabled: {
        type: Number,
        enum: [1, 0]
      },
      _2factor_auth_type: {
        type: String,
        enum: ['Email'],
      },
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