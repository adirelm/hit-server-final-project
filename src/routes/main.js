/**
 * first name: Adir
 * last name: Elmakais
 * id: 316413640
 *
 * first name: Idan
 * last name: Refaeli
 * id: 207351941
 *
 * first name: Ron
 * last name: Kipnis
 * id: 207275371
 */

const express = require('express');
const { User } = require('../models/users');
const { Cost } = require('../models/costs');
const { ApiError } = require('../utils/error');
const { categories } = require('../models/costs');

const mainRouter = express.Router();

mainRouter.post('/addcost', async (req, res, next) => {
  try {
    // Generate a unique ID for the cost
    const id = Math.floor(Math.random() * new Date().getTime());
    const {
      user_id: userId,
      year,
      month,
      day,
      description,
      category,
      sum,
    } = req.body;

    // Check if any required data is missing
    if (!year || !month || !day || !description || !category || !sum) {
      throw new ApiError(400, 'Some data is missing');
    }

    // Check if the provided category is valid
    if (!categories.includes(category)) {
      throw new ApiError(400, 'Invalid category');
    }

    // Check if the month and day values are valid
    if (month > 12 || month <= 0 || day >= 31 || day <= 0) {
      throw new ApiError(400, 'Invalid month or day');
    }

    // Find the user with the specified ID
    const user = await User.findOne({ id: userId });

    // If user not found, throw an error
    if (!user) {
      throw new ApiError(400, `User ${userId} not found`);
    }

    // Create a new cost object with the provided data
    const cost = new Cost({ id, ...req.body });
    await cost.save();

    // Clear the existing report for the specified month and year, if it exists
    if (user.reports[`${month}:${year}`]) {
      user.reports = { ...user.reports, [`${month}:${year}`]: undefined };
      await user.save();
    }

    // Respond with the created cost object
    res.status(201).json(cost);
  } catch (err) {
    next(err);
  }
});

mainRouter.get('/report', async (req, res, next) => {
  try {
    // Get the 'year' query parameter from the request
    const year = req.query.year;
    // Get the 'month' query parameter from the request
    const month = req.query.month;
    // Get the 'user_id' query parameter from the request
    const userId = req.query.user_id;

    // Validate if 'year' and 'month' parameters are present
    if (!year || !month) {
      throw new ApiError(400, 'Invalid request, please specify month and year');
    }

    // Validate if 'month' parameter is within the valid range (1-12)
    if (month < 1 || month > 12) {
      throw new ApiError(400, 'Invalid month');
    }

    // Find the user based on the 'userId'
    const user = await User.findOne({ id: userId });

    // Check if the user exists
    if (!user) {
      throw new ApiError(400, `User ${userId} not found`);
    }

    // Get the report for the specified month and year
    let report = user.reports[`${month}:${year}`];

    // If the report doesn't exist, generate it by querying the matching costs
    if (!report) {
      const matchedCosts = await Cost.find({
        year: year,
        month: month,
        user_id: user.id,
      });

      // Generate the report object by categorizing the matched costs
      report = matchedCosts.reduce(
        (obj, { day, description, sum, category }) => {
          obj[category].push({ day, description, sum });
          return obj;
        },
        {
          food: [],
          health: [],
          housing: [],
          sport: [],
          education: [],
          transportation: [],
          other: [],
        }
      );

      // Update the user's reports with the newly generated report
      user.reports = { [`${month}:${year}`]: report, ...user.reports };
      await user.save();
    }

    // Send the report as the response
    res.status(200).json(report);
  } catch (err) {
    next(err);
  }
});

mainRouter.get('/about', (req, res, next) => {
  const developers = [
    {
      firstname: 'adir',
      lastname: 'elmakais',
      id: 316413640,
      email: 'adir4455@gmail.com',
    },
    {
      firstname: 'idan',
      lastname: 'refaeli',
      id: 207351941,
      email: 'idanref@gmail.com',
    },
    {
      firstname: 'roni',
      lastname: 'kipnis',
      id: 207275371,
      email: 'ronikipnis112233@gmail.com',
    },
  ];

  // Send the 'developers' array as the response
  res.status(200).send(developers);
});

module.exports = mainRouter;
