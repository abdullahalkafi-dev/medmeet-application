"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilePaths = void 0;
const getFilePath = (files, folderName) => {
    if (files && files.image[0].fieldname in files && files.image[0]) {
        return `/${folderName}/${files.image[0].filename}`;
    }
    return null;
};
exports.default = getFilePath;
const getFilePaths = (files, folderName) => {
    if (files && files.image) {
        return files.image.map((file) => `/${folderName}/${file.filename}`);
    }
    return [];
};
exports.getFilePaths = getFilePaths;
