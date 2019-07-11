const user = {
    id: "1",
    name: "Filip",
    email: "filip@test.com",
    picture: "https://cloudinary.com/adsad"
}

module.exports = {
    Query: {
        me: () => user
        
    }
}