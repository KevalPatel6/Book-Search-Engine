const { signToken, AuthenticationError } = require('../utils/auth');
const { User, bookSchema } = require('../models');

const resolvers = {
    Query: {
        getSingleUser: async () => {
            return User.findOne({ username })
        }
    },

    Mutation: {
        createUser: async (parent, { username, email, password }) => {
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

        saveBook: async (parent, {authors, description, bookId, image, link}) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
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