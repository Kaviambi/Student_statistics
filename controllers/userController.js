const { User, Thought } = require('../models');

module.exports = {
    // Get all users
    getUser(req, res) {
        User.find({})
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },

    //Get single user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            // populate thought and friend data 
            .populate('thoughts')
            .populate('friends')
            .select('-__v')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    //Create a user
    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    //Update a user
    updateUser(req,res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true}
        )
        .then((user) =>
        !user
        ? res.status(404).json({ message: 'No User with this id' })
        : res.json(user))
    .catch((err) => res.status(500).json(err));
    },

    //delete a user 
deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
    .then((user) => 
    !user
    ? res.status(404).json({ message: 'No User with this id' })
    : Thought.deleteMany({ _id: { $in: user.thoughts } })
    )
    .then((user) =>
        !user
        ? res.status(404).json({ message: 'No User with this id' })
        : res.json(user))
    .catch((err) => res.status(500).json(err));
},

    //add a friend 
addFriend(req,res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        {$set: { friends: req.params.friendId } },
        { runValidators: true, new: true}
    )
    .then((user) =>
    !user
    ? res.status(404).json({ message: 'No User with this id' })
    : res.json(user))
.catch((err) => res.status(500).json(err));
},

    //remove a friend 
    removeFriend(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'user and thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
        
    },
};

