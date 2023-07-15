const {expressjwt} = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressjwt({
        secret,
        algorithms:['HS256'],
        isRevoked : isRevoked
    }).unless({
        path : 
        [
            {url : /\/public\/uploads(.*)/,methods : ['GET', 'OPTIONS']},
            {url : /\/api\/v1\/products(.*)/,methods : ['GET', 'OPTIONS']},
            {url : /\/api\/v1\/categories(.*)/,methods : ['GET', 'OPTIONS']},
            {url : /\/api\/v1\/users(.*)/,methods : ['GET', 'OPTIONS']},
            {url : /\/api\/v1\/orders(.*)/,methods : ['GET', 'OPTIONS']},
            {url : /\/api\/v1\/users(.*)/,methods : ['PUT', 'OPTIONS']},
            `${api}/users/login`, 
            `${api}/users/create`, 
        ]
    })
}

async function isRevoked (req, payload, done) {
    if(!payload.isAdmin) {
        return done(null, true);
    }

    done();
}

module.exports = authJwt;