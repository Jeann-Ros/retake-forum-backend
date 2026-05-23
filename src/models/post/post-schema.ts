import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    postNumber: {
      type: Number,
      required: true,
      default: 0,
    },
    titulo: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    autorNickname: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      required: true,
    },
    likedBy: [{ type: String }],
    commentaries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true },
);

const PostModel = mongoose.model("Post", PostSchema);

export default PostModel;
