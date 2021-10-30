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