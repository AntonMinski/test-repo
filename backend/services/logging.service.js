const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const accessLogStream = fs.createWriteStream(path.join(__dirname, '../access.log'), { flags: 'a' })

module.exports = (app) => {

    morgan.token('user', function (req) {
        return req.userInfo;
    });

    app.use(morgan('method: :method; url: :url; date: :date; status: :status; user: :user',
        {
            stream: accessLogStream,
            skip: (req, res) =>
                !req.baseUrl?.includes('auth') || !req.url?.includes('auth')
        }
    ));

    return morgan;
}
