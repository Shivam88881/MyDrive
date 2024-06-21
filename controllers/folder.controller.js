const Folder = require("../models/folder.model.js");
const TryCatchAsync = require("../middleware/tryCatchAsync");


exports.create = TryCatchAsync(async(req, res) => {
    const { name, user, parent } = req.body;
    const newFolder = await Folder.create({
        name,
        user,
        parent
    });
    res.status(201).json({
        success: true,
        newFolder
    });
})


const deleteChildren = async (folder) => {
    for (let childId of folder.children) {
        let childFolder = await Folder.findById(childId);
        if (childFolder) {
            await deleteChildren(childFolder);
            await childFolder.remove();
        }
    }

    // Assuming you have a File model and each folder has an array of file IDs
    for (let fileId of folder.files) {
        await File.findByIdAndRemove(fileId);
    }
}

exports.deleteFolder = TryCatchAsync(async(req, res) => {
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
        res.status(404).json({  message: "Folder not found" });
        return;
    }

    await deleteChildren(folder);
    const parentFolder = await Folder.findById(folder.parent);
    parentFolder.children = parentFolder.children.filter((childId) => childId.toString() !== folder._id.toString());
    await parentFolder.save();
    await folder.remove();

    res.status(200).json({  message: "Folder and all subfolders and files deleted successfully" });
});

exports.getAllFolders = TryCatchAsync(async(req, res) => {
    const {parent,page} = req.body;
    const limit = DBConstants.LIMIT;
    const skip = (page-1)*limit;
    const folders = await Folder.find({parent}).skip(skip).limit(limit);
    res.status(200).json({
        success: true,
        folders
    });
})

exports.getFolder = TryCatchAsync(async(req, res) => {
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
        res.status(404).json({  message: "Folder not found" });
        return;
    }
    res.status(200).json({
        success: true,
        folder
    });
})

exports.updateFolderName = TryCatchAsync(async(req, res) => {
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
        res.status(404).json({  message: "Folder not found" });
        return;
    }
    folder.name = req.body.name;
    await folder.save();
    res.status(200).json({
        success: true,
        folder
    });
})

exports.moveFolder = TryCatchAsync(async(req, res) => {
    if (!req.body.parent) {
        res.status(400).json({  message: "Content can not be empty!" });
        return;
    }
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
        res.status(404).json({  message: "Folder not found" });
        return;
    }

    folder.parent = req.body.parent;
    await folder.save();
    res.status(200).json({
        success: true,
        folder
    });
})



