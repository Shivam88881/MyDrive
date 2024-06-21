const mongoose = require('mongoose');


const FolderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    },
    children: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Folder',
        default: []
    },
    files: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'File',
        default: []
    }
},
{
    timestamps: true
}

);


module.exports = mongoose.model('Folder', FolderSchema);