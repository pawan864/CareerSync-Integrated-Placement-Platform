/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Middleware/AdvancedResults
 * @description Advanced query execution middleware for pagination, sorting, filtering, and field selection.
 * Designed by Vikas Yadav (Database & Backend Architecture).
 */
const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from query matching
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string and add MongoDB comparison operators ($gt, $gte, etc.)
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    const parsedQuery = JSON.parse(queryStr);

    // Keyword search support if 'search' query parameter is provided
    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search.trim(), 'i');
        parsedQuery.$or = [
            { title: searchRegex },
            { name: searchRegex },
            { 'academicInfo.department': searchRegex }
        ];
    }

    // Finding resource
    query = model.find(parsedQuery);

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments(parsedQuery);

    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }

    // Executing query
    const results = await query;

    // Pagination result object
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.advancedResults = {
        success: true,
        total,
        count: results.length,
        pagination,
        data: results
    };

    next();
};

module.exports = advancedResults;
