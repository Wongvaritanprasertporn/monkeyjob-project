const validator = require('validator');

const userSchema = module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      profile_img: {
        type: String,
      },
      business: {
        type: String,
      },
      name: {
        type: String,
      },
      surname: {
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
      phone: {
        type: String,
      },
      telephone: {
        type: String,
      },
      dob: {
        type: String,
      },
      password: {
        type: String
      },
      user_type: {
        type: String,
        enum: [1, 2],  // 1 - Student, 2 - Business
      },
      website: {
        type: String,
      },
      team_size: {
        type: String,
      },
      company_description: {
        type: String,
      },
      address: {
        type: String,
      },
      summary: {
        type: String,
      },
      resume: {
        type: String,
      },
      works: {
        type: String,
      },
      educations: {
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
        default: 0,
        enum: [1, 0]
      },
      _2factor_auth_type: {
        type: String,
        enum: ['Email', 'Sms'],
      },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("users", schema);
};