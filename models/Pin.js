const mongooose = require('mongoose');

const PinSchema = new mongooose.Schema({
    title: String,
    content: String,
    image: String,
    latitude: Number,
    longitude: Number,
    author: {type: mongooose.Schema.ObjectId, ref: "User"},
    comments: [
        {
            text: String,
            createdAt: { type: Date, default: Date.now },
            author: {type: mongooose.Schema.ObjectId, ref: "User"}
        }
    ]
}, {timestamps: true})    

module.exports = mongooose.model("Pin", PinSchema);