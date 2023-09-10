const { Schema, model } = require('mongoose');

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
    //   get: (timestamp) => dateFormat(timestamp),
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
);

const thoughtSchema = new Schema(
  {
    thoughtId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    thoughtText: {
      type: String,
      required: true,
      maxlength: 50,
      minlength: 4,
      default: 'Unnamed assignment',
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    //   get: (timestamp) => dateFormat(timestamp),
    },
    reactions: [reactionSchema]
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;