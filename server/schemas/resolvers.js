const { signToken, AuthenticationError } = require('../utils/auth');
const { User, bookSchema } = require('../models');

const resolvers = {
    Query: {
        me: async () => {
            return User.findOne({ username }).populate('savedBooks')
            //Do I want to populate anything here?
        }
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password })
            const token = signToken(user);
            return { token, user }
        },

        login: async () => {
            const user = await User.findOne({ $or: [{email},{username}]});

            if (!user) {
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw AuthenticationError;
            }

            const token = signToken(user);

            return { token, user };
        },

        saveBook: async (parent, {BookInput}) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: ID },
                { $addToSet: { savedBooks: body } },
                { new: true, runValidators: true }
              );
              return updatedUser
        },

        deleteBook: async (parent, {bookId}) => {
            const updatedUser = await User.findOneAndUpdate(
                { bookId: bookId},
                { $pull: { savedBooks: { bookId } } },
                { new: true }
              );
              return updatedUser
        },
    }



}

module.exports = resolvers;