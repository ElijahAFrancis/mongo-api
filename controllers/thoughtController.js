const { User, Thought } = require('../models');

const thoughtController = {

  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find({});

      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findByID(req.params.thoughtId)
        .select('-__v');

      if (!thought) {
        return res.status(404).json({ message: 'No Thought with that ID' })
      }

      res.json({thought});
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body)
      .then(dbThoughtData => {
        User.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { thoughts: dbThoughtData._id } },
            { new: true },
        )
      });
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body);
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.thoughtId )
      .then(dbThoughtData => {
        User.findOneAndUpdate(
            { username: dbThoughtData.username },
            { $pull: { thoughts: dbThoughtData._id } },
            { new: true },
        )
      })

      if (!thought) {
        return res.status(404).json({ message: 'No Thought with that ID' });
      }

      res.json({ message: 'Thought deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },


  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtrId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No Thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.body } } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No Thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};


module.exports = thoughtController