const mongoose = require('mongoose');

// Define the user schema for the User model
const userSchema = new mongoose.Schema(
  {
    // User's ID (assuming it's a number)
    id: { type: Number },
    // User's first name
    firstName: { type: String },
    // User's last name
    lastName: { type: String },
    // User's birthday (as a Date object)
    birthday: { type: Date },
    // User's reports (as an object)
    reports: {
      type: Object,
      // Default value is an empty object
      default: {},
    },
  },
  {
    // toJSON transform options
    toJSON: {
      // Transform function to customize the returned JSON
      transform(doc, ret) {
        // Remove the _id field from the transformed JSON
        delete ret._id;
        // Remove the __v field from the transformed JSON
        delete ret.__v;
      },
    },
  }
);

// Create the User model using the userSchema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = { User };
