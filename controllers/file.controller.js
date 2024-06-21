const File = require('../models/file.model');
const Folder = require('../models/folder.model');
const TryCatchAsync = require('../middleware/tryCatchAsync');
const DBConstants = require('../constants/databaseConstants');


exports.create = TryCatchAsync(async(req, res) => {
    const { name, user, parent, extension, path, size } = req.body;
    const newFile = await File.create({
        name,
        user,
        parent,
        extension,
        path,
        size
    });
    res.status(201).json({
        success: true,
        newFile
    });
})


exports.deleteFile = TryCatchAsync(async(req, res) => {
    const file = await File.findById(req.params.id);
    if (!file) {
        res.status(404).json({  message: "File not found" });
        return;
    }
    
    const parentFolder = await Folder.findById(file.parent);
    if (parentFolder) {
        parentFolder.files = parentFolder.children.filter(id => id.toString() !== file._id.toString());
        await parentFolder.save();
    }

    await file.remove();
    res.status(200).json({
        success: true,
        message: "File deleted successfully"
    });

})


exports.updateFileName = TryCatchAsync(async(req, res) => {
    const file = await File.findById(req.params.id);
    if (!file) {
        res.status(404).json({  message: "File not found" });
        return;
    }
    const { name } = req.body;
    if (!name) {
        res.status(400).json({  message: "Content can not be empty!" });
        return;
    }
    file.name = name;
    await file.save();
    res.status(200).json({
        success: true,
        message: "File updated successfully"
    });
})

exports.getAllFiles = TryCatchAsync(async(req, res) => {
    const {parent,page} = req.body;

    const limit = DBConstants.LIMIT;
    const skip = (page-1)*limit;
    const files = await File.find({parent}).skip(skip).limit(limit);
    res.status(200).json({
        success: true,
        files
    });
    
})

exports.getFile = TryCatchAsync(async(req, res) => {
    const file = await File.findById(req.params.id);
    if (!file) {
        res.status(404).json({  message: "File not found" });
        return;
    }
    res.status(200).json({
        success: true,
        file
    });
})


exports.moveFile = TryCatchAsync(async(req, res) => {
    if (!req.body.parent) {
        res.status(400).json({  message: "Content can not be empty!" });
        return;
    }
    const file = await File.findById(req.params.id);
    if (!file) {
        res.status(404).json({  message: "File not found" });
        return;
    }
    file.parent = req.body.parent;
    await file.save();
    res.status(200).json({
        success: true,
        file
    });
})


