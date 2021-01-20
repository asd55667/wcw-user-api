const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const idPlugin = require("mongoose-id");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      // required: true,
      default: null,
    },
    avatar_url: {
      type: String,
      default: "https://avatars0.githubusercontent.com/u/38181164?v=4",
    },

    key: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["superuser", "user", "create", "update", "delete"],
    },
  },
  { autoCreate: true }
);

userSchema.plugin(mongoosePaginate);
userSchema.plugin(idPlugin);

const User = mongoose.model("User", userSchema);

module.exports = User;
