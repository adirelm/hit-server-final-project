const mongoose = require('mongoose');

// Categories array used in the costSchema
const categories = [
  'food',
  'health',
  'housing',
  'sport',
  'education',
  'transportation',
  'other',
];

// Define the cost schema for the Cost model
const costSchema = new mongoose.Schema(
  {
    // Unique identifier for the cost
    id: { type: Number },
    // Reference to the User model
    user_id: { type: String, ref: 'User' },
    // Year of the cost
    year: { type: Number },
    // Month of the cost
    month: { type: Number },
    // Day of the cost
    day: { type: Number },
    // Description of the cost
    description: { type: String },
    // Category of the cost (e.g., food, health, etc.)
    category: { type: String },
    // Amount/sum of the cost
    sum: { type: Number },
  },
  {
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

// Create the Cost model using the costSchema
const Cost = mongoose.model('Cost', costSchema);

// Export the categories array and the Cost model
module.exports = { categories, Cost };
