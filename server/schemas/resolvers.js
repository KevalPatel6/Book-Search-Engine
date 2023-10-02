const { signToken, AuthenticationError } = require('../utils/auth');
const { User } = require('../models');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user){
                return User.findOne({_id: context.user._id}).populate('savedBooks')
            }
            throw AuthenticationError
        }
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password })
            const token = signToken(user);
            return { token, user }
        },

        login: async (parent, {email, password, username}) => {
            const user = await User.findOne({ $or: [{email},{username}]});

            if (!user) {
                throw AuthenticationError
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw AuthenticationError;
            }

            const token = signToken(user);

            return { token, user };
        },

        saveBook: async (parent, {input}, context) => {
            console.log(input)
            console.log(context)
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: input } },
                { new: true, runValidators: true }
              );
              return updatedUser
        },

        removeBook: async (parent, {bookId}, context) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id},
                { $pull: { savedBooks: { bookId } } },
                { new: true }
              );
              return updatedUser
        },
    }
}

module.exports = resolvers;