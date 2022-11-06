const { model, Schema } = require('mongoose');


const SchemaRole = Schema({
    value: {
        type: String,
        unique: true,
        default: "USER",
    }
}, {
    versionKey: false, 
    timestamps: true,
    }  
)


const RoleModel = model('role', SchemaRole)


module.exports = RoleModel;