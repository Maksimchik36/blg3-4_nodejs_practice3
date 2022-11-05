const { model, Schema } = require('mongoose');

const SchemaUser = Schema({
    userName: {
        type: String, 
        default: "John Doe",
    },
    userEmail: {
        type: String, 
        required: [true, "DB: Email is required"],
    },
    userPassword: {
        type: String, 
        required: [true, "DB: Password is required"],
    },
    token: {
        type: String,
        default: null,
    },
    // roles: {
    // }    
},
    {
    versionKey: false, 
    timestamps: true, 
})




const UserModel = model('user', SchemaUser)


module.exports = UserModel;