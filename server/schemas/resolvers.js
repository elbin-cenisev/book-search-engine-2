const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, {email, password}, context) => {
            if(context.user) {
                return User.findOne({ _id: context.user._id }).populate('savedBooks')
            }
            throw new AuthenticationError("You need to be logged in!");
        }
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPW = await user.isCorrectPassword(password);

            if(!correctPW) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { authors, description, bookId, image, link, title }, context) => {
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $addToSet: { savedBooks: body } },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            } catch (err) {
                console.log(err);
            }
        },
        removeBook: async (parent, { bookId }, context) => {
            const updatedUser = await User.findOneAndUpdate(
                {_id: user._id},
                { $pull: {savedBooks: {bookId: params.bookId}}},
                { new: true}
            );
            if(!updatedUser) {
                throw new AuthenticationError("Couldn't find user with this id!");
            }
            return updatedUser;
        }
    }
};
module.exports = resolvers;