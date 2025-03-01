"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const http_status_codes_1 = require("http-status-codes");
const contact_model_1 = require("./contact.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createContactToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingContact = yield contact_model_1.Contact.findOne();
        if (existingContact) {
            const { image } = payload, remainingData = __rest(payload, ["image"]);
            const modifiedUpdateData = Object.assign({}, remainingData);
            if (image && image.length > 0) {
                const updatedImages = [...existingContact.image];
                // Update only specified images by index
                image.forEach((newImage, index) => {
                    if (newImage) {
                        updatedImages[index] = newImage;
                    }
                });
                // Assign the updated images array to the update data
                modifiedUpdateData.image = updatedImages;
            }
            // Apply updates to the existing contact
            Object.assign(existingContact, modifiedUpdateData);
            const updatedContact = yield existingContact.save();
            return updatedContact;
        }
        else {
            // If no existing contact, create a new one
            const newContact = yield contact_model_1.Contact.create(payload);
            return newContact;
        }
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create contact');
    }
});
const getContactFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contact_model_1.Contact.findOne();
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Contact not found');
    }
    return result;
});
exports.ContactService = {
    createContactToDB,
    getContactFromDB,
};
