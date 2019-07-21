const User = require('../models/User');
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID)

exports.findOrCreateUser = async token => {
    //verify token
    const googleUser = await verifyAuthToken(token)
    //check if user exist

    //if user exists return it
    const user = await checkUserExists(googleUser.email)

    //otherwise create user
    return user ? user : craeteNewUser(googleUser)
}

const verifyAuthToken = async token => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.OAUTH_CLIENT_ID
        })
        return ticket.getPayload()
    } catch (error) {
        console.error(`Error verifying token ${error}`);
    }
}

const checkUserExists = async email => await User.findOne({email}).exec();

const craeteNewUser = googleUser => {
    const {name, email, picture} = googleUser;
    const user = { name, email, picture}
    return new User(user).save()
}