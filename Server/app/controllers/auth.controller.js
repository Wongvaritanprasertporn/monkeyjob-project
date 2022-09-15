const jwt = require("../helpers/jwt/index");
const twilio = require("../helpers/twilio/index");
const mail = require("../helpers/email/index");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = require("../models");
const { json } = require("body-parser");
const { users } = require("../models");

exports.loginAuth = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(400).send({
        message: "Email & Password required.",
      });
      return;
    }

    const data = await db.users.find({
      email: req.body.email,
    });

    if (!data) {
      res.status(400).send({
        message: `Incorrect email or password`,
      });
    } else {
      if (data[0].login_method != "Email") {
        res.status(400).send({
          message: `Please use ${data.login_method} method.`,
        });
        return;
      }

      if (!data[0].is_active) {
        res.status(400).send({
          message: `Account is not active. Contact admin`,
        });
        return;
      }

      const match = await bcrypt.compare(req.body.password, data[0].password);
      if (match) {
        if (data[0].is_2factor_auth_enabled && data[0].email) {
          const randToken = Math.floor(1000 + Math.random() * 9000);

          mail._2FactorAuth(function (e) {}, {
            token: randToken,
            email: req.body[0],
          });

          const tokens = new db["tokens"](req.body);
          await tokens.save(tokens);

          res.send({
            is_2factor_auth_enabled: data[0].is_2factor_auth_enabled,
            email: data[0].email,
          });
        } else {
          res.send({
            access_token: jwt.accessTokenEncode(data[0]),
            refresh_token: jwt.refreshTokenEncode(data[0]),
            user: data[0],
          });
        }
      } else {
        res.status(400).send({
          message: "Incorrect email or password",
        });
        return;
      }
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

exports.createAuth = async (req, res) => {
  try {
    if (req.params.document == "users") {

      const user = await db.users.find({
        email: req.body.data.email,
      });

      console.log(req.body.logo);

      if (user == []) {
        res.status(400).send({
          message: "Email already in use.",
          login_method: user.login_method,
        });
      } else {
        req.body.login_method = "Email";
        req.body._2factor_auth_type = "Email";

        bcrypt.hash(
          req.body.password,
          saltRounds,
          async function (error, hash) {
            req.body.data.password = hash;
            let users = [];
            if (req.body.data.user_type == 1) {
              users = new db.users({
                profile_img: req.body.logo,
                user_type: 1,
                business: req.body.data.business,
                name: req.body.data.name,
                surname: req.body.data.surname,
                email: req.body.data.email,
                address: req.body.data.address,
                telephone: req.body.data.tel,
                company_description: req.body.data.description,
                password: req.body.data.password,
                login_method: "Email",
                _2factor_auth_type: "Email",
              });
            } else {
              users = new db.users({
                profile_img: req.body.logo,
                user_type: 2,
                name: req.body.data.name,
                surname: req.body.data.surname,
                email: req.body.data.email,
                address: req.body.data.address,
                phone: req.body.data.phone,
                telephone: req.body.data.tel,
                dob: req.body.data.dob,
                address: req.body.data.address,
                summary: req.body.data.record,
                resume: req.body.data.introduce,
                password: req.body.data.password,
                login_method: "Email",
                _2factor_auth_type: "Email",
              });
            }

            const data = await users.save(users);

            res.send({
              access_token: jwt.accessTokenEncode(data),
              refresh_token: jwt.refreshTokenEncode(data),
              user: data,
            });
          }
        );
      }
    } else if (req.params.document == "admin") {
      const user = await db["admin"].find({
        email: req.body.email,
      });

      console.log(req.body)

      if (user == []) {
        res.status(400).send({
          message: "Email already in use.",
        });
      } else {

        bcrypt.hash(
          req.body.password,
          saltRounds,
          async function (error, hash) {
            req.body.password = hash;
            let admin = [];

            admin = new db.admin({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              login_method: "Email",
              is_2factor_auth_enabled: 1,
              _2factor_auth_type: "Email",
            });

            const data = await admin.save(admin);

            res.send({
              access_token: jwt.accessTokenEncode(data),
              refresh_token: jwt.refreshTokenEncode(data),
              user: data,
            });
          }
        );
      }
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.accessToken = async (req, res) => {
  if (!req.body.access_token) {
    res.status(400).send({
      message: "Access token is required.",
    });
    return;
  }

  jwt.accessTokenDecode(async function (e) {
    if (e.status) {
      try {
        const user = await db[req.params.document].findById(e.data.id);
        if (!user) {
          res.status(404).send({
            message: "No user found.",
          });
        } else {
          res.send(user);
        }
      } catch (error) {
        res.status(500).send({
          message: error.message || "Something went wrong.",
        });
      }
    } else {
      res.status(e.code).send({
        message: e.message,
      });
    }
  }, req.body.access_token);
};

exports.refreshToken = async (req, res) => {
  if (!req.body.refresh_token) {
    res.status(400).send({
      message: "Refresh token is required.",
    });
    return;
  }

  jwt.refreshTokenDecode(function (e) {
    if (e.status) {
      res.send({
        access_token: jwt.accessTokenEncode(e.data),
        refresh_token: jwt.refreshTokenEncode(e.data),
      });
    } else {
      res.status(e.code).send({
        message: e.message,
      });
    }
  }, req.body.refresh_token);
};

exports.forgotPassword = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).send({
        message: "Email required.",
      });
      return;
    }

    const data = await db.users.find({
      email: req.body[0],
    });

    if (!data) {
      res.status(400).send({
        message: "Email not found.",
      });
    } else {
      if (data[0].login_method != "Email") {
        res.status(400).send({
          message: `Please use ${data[0].login_method} method.`,
        });
        return;
      }

      if (!data[0].is_active) {
        res.status(400).send({
          message: `Account is not active. Contact admin`,
        });
        return;
      }

      if (data[0].login_method == "Email") {
        const randToken = Math.floor(1000 + Math.random() * 9000);
        console.log(req.body + " " + randToken);
        mail.forgotPassword(
          async function (e) {
            if (e.status) {
              const tokens = new db.tokens({
                token: randToken,
                email: req.body[0],
              });
              await tokens.save(tokens);
              res.send({
                message: "Verification code has been sent.",
                email: req.body[0],
              });
            } else {
              res.status(401).send({
                message: e.message,
              });
            }
          },
          { token: randToken, email: req.body[0] }
        );
      }
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
    res.status(400).send({
      message: error.message + " " + req.body,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    if (!req.body.password || !req.body.token) {
      res.status(400).send({
        message: "Email & Password & Verification code is required.",
      });
      return;
    }

    var condition = {
      email: req.body.email,
      token: req.body.token,
    };

    const data = await db.tokens.find(condition);

    console.log(data);

    if (!data) {
      res.status(400).send({
        message: "Verification code is invalid.",
      });
    } else {
      bcrypt.hash(req.body.password, saltRounds, async function (error, hash) {
        req.body.password = hash;
        const data = await db.users.findOneAndUpdate(
          {
            email: req.body.email,
          },
          { password: req.body.password }
        );

        res.send({
          access_token: jwt.accessTokenEncode(data),
          refresh_token: jwt.refreshTokenEncode(data),
          user: data,
        });
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.verify = async (req, res) => {
  try {
    if (!req.body.email || !req.body.token) {
      res.status(400).send({
        message: "Email Verification code is required.",
      });
      return;
    }

    var condition = {
      email: req.body.email,
      token: req.body.token,
    };

    const data = await db["tokens"].findOne(condition);

    if (!data) {
      res.status(400).send({
        message: "Verification code is invalid.",
      });
    } else {
      const data = await db[req.params.document].findOne({
        email: req.body.email,
      });

      res.send({
        access_token: jwt.accessTokenEncode(data),
        refresh_token: jwt.refreshTokenEncode(data),
        user: data,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.createAuthWithPhone = async (req, res) => {
  try {
    if (!req.body.phone) {
      res.status(400).send({
        message: "Phone is required.",
      });
      return;
    }

    var condition = {
      phone: req.body.phone,
    };

    const data = await db[req.params.document].findOne(condition);

    if (data) {
      if (data.login_method != "Phone") {
        res.status(400).send({
          message: `Please use ${data.login_method} method to login.`,
        });
        return;
      }

      if (!data.is_active) {
        res.status(400).send({
          message: `Account is not active. Contact admin`,
        });
        return;
      }
    }

    req.body.token = Math.floor(1000 + Math.random() * 9000);
    twilio.send(
      async function (e) {
        console.log(e);
        if (e.status) {
          const tokens = new db["tokens"]({
            token: req.body.token,
            phone: req.body.phone,
          });
          await tokens.save(tokens);

          if (data) {
            res.send({
              message: "The verification code has been sent.",
              phone: req.body.phone,
            });
          } else {
            req.body.login_method = "Phone";
            const users = new db[req.params.document](req.body);
            await users.save(users);
            res.send({
              message: "The verification code has been sent.",
              phone: req.body.phone,
            });
          }
        } else {
          res.status(401).send({
            message: e.message,
          });
        }
      },
      req.body.phone,
      req.body.token
    );
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.createAuthWithPhoneVerify = async (req, res) => {
  try {
    if (!req.body.phone || !req.body.token) {
      res.status(400).send({
        message: "Phone & Verification code is required.",
      });
      return;
    }

    var condition = {
      phone: req.body.phone,
      token: req.body.token,
    };

    const data = await db["tokens"].findOne(condition);

    if (data) {
      const data = await db[req.params.document].findOne({
        phone: req.body.phone,
      });
      res.send({
        access_token: jwt.accessTokenEncode(data),
        refresh_token: jwt.refreshTokenEncode(data),
        user: data,
      });
    } else {
      res.status(400).send({
        message: "The verification code did not match.",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.createAuthWithGoogle = async (req, res) => {
  try {
    if (!req.body.email) {
      res.status(400).send({
        message: "Email is required.",
      });
      return;
    }

    var condition = {
      email: req.body.email,
    };

    const data = await db[req.params.document].findOne(condition);

    if (data) {
      if (data.login_method != "Google") {
        res.status(400).send({
          message: `Please use ${data.login_method} method to login.`,
        });
        return;
      }

      if (!data.is_active) {
        res.status(400).send({
          message: `Account is not active. Contact admin`,
        });
        return;
      }

      if (data.login_method == "Google") {
        res.send({
          access_token: jwt.accessTokenEncode(data),
          refresh_token: jwt.refreshTokenEncode(data),
          user: data,
        });
      }
    } else {
      req.body.login_method = "Google";
      const users = new db[req.params.document](req.body);
      const data = await users.save(users);
      res.send({
        access_token: jwt.accessTokenEncode(data),
        refresh_token: jwt.refreshTokenEncode(data),
        user: data,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.createAuthWithApple = async (req, res) => {
  try {
    console.log(req.body);
    return res.send(
      `<script>
                const APPLE_SIGN_IN_DATA = ${JSON.stringify(req.body)}
                if (window.opener) {
                    window.opener.postMessage(APPLE_SIGN_IN_DATA, 'https://stuwork.webgarh.net/');
                    window.close();
                }
            </script>`
    );
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.createAuthWithAppleGo = async (req, res) => {
  try {
    if (!req.body.email) {
      res.status(400).send({
        message: "Email is required.",
      });
      return;
    }

    var condition = {
      email: req.body.email,
    };

    const data = await db[req.params.document].findOne(condition);

    if (data) {
      if (data.login_method != "Apple") {
        res.status(400).send({
          message: `Please use ${data.login_method} method to login.`,
        });
        return;
      }

      if (!data.is_active) {
        res.status(400).send({
          message: `Account is not active. Contact admin`,
        });
        return;
      }

      if (data.login_method == "Apple") {
        res.send({
          access_token: jwt.accessTokenEncode(data),
          refresh_token: jwt.refreshTokenEncode(data),
          user: data,
        });
      }
    } else {
      req.body.login_method = "Apple";
      const users = new db[req.params.document](req.body);
      const data = await users.save(users);
      res.send({
        access_token: jwt.accessTokenEncode(data),
        refresh_token: jwt.refreshTokenEncode(data),
        user: data,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};
