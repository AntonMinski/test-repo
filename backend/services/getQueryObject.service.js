/* This service takes query from response (that query created at the frontend)
and returns new object, which can be used with Mongoose operation "find"
example: mongoose.find({ debt: { $gt: 0 }, userId: '12345abcdefg }) */

const getMongooseQuery = (query, userId) => {
    const mongooseQuery = {}
    if (query) {
        if (query.search) {
            mongooseQuery['$or'] = [
                {name: {$regex: query.search, $options: 'i'}},
                {phone: {$regex: query.search, $options: 'i'}},
                {address: {$regex: query.search, $options: 'i'}},
            ];
        }
        switch (query.debt) {
            case 'debt':
                mongooseQuery.debt = { $gt: 0 };
                break
            case 'clear':
                mongooseQuery.debt = { $lte: 0 };
        }
    }
    mongooseQuery.userId = userId;
    return mongooseQuery;

}

module.exports = getMongooseQuery;
