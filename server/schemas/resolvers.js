const resolvers = {
    Query: {
        me: async (parent, {email, password}, context) => {
            if(context.user) {
                return User.findOne({ _id: context.user._id }).populate('savedBooks')
            }
            throw new AuthenticationError("You need to be logged in!");
        }
    },
        
    }
};
module.exports = resolvers;