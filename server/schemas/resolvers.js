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
        login: async () => {
            const user = await User.findOne({
                $or: [{ username: username }, { email: email }]
            });
            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPW = await user.isCorrectPassword(body.password);

            if(!correctPW) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },
    }
};
module.exports = resolvers;