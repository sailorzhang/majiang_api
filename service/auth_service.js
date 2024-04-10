var jwt = require('jsonwebtoken')


module.exports = (req, res, next) => {

    const { authorization } = req.headers;
    if (!authorization || authorization.indexOf('Bearer ') !== 0) {
        res.status(401).send('Unauthorized');
    }

    const token = authorization.replace('Bearer ', '');
    var jwksClient = require('jwks-rsa');
    var client = jwksClient({
        jwksUri: 'https://login.microsoftonline.com/8031b119-c3b2-41dc-8929-9017023ea4d9/discovery/v2.0/keys'
    });
    function getKey(header, callback) {
        client.getSigningKey(header.kid, function (err, key) {
            if (err) {
                console.log(err);
                callback(err, signingKey);
                return;
            }
            var signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
        });
    }

    jwt.verify(token, getKey, {
        audience: '62d787e7-5604-4126-b97f-47cfc5773de5',
        issuer: 'https://sts.windows.net/8031b119-c3b2-41dc-8929-9017023ea4d9/'
    }, function (err, decoded) {
        if (err) {
            res.status(403).send('Access Denied');
        } else {
            req.activateUser = decoded;
            if (!decoded.roles || decoded.roles?.length === 0 || decoded.roles?.indexOf('majiang.admin') < 0) {
                res.status(403).send('Access Denied');
            }
            next()
        }
    });
}