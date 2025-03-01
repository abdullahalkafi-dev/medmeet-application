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
Object.defineProperty(exports, "__esModule", { value: true });
const subscribtion_model_1 = require("../../app/modules/subscribtion/subscribtion.model");
const handleInvoicePaymentSucceeded = (invoice) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer, subscription, amount_paid, customer_email, customer_name, } = invoice;
        // Extracting necessary details from the invoice
        const customerId = customer;
        const subscriptionId = subscription;
        const priceAmount = amount_paid / 100 || 0;
        const email = customer_email;
        const name = customer_name;
        // Update the subscription in the database or create if it doesn't exist
        yield subscribtion_model_1.Subscribation.findOneAndUpdate({ subscriptionId }, { priceAmount, email, name }, { new: true, upsert: true } // If not found, create a new record
        );
    }
    catch (error) {
        console.error('Error handling invoice payment succeeded:', error);
    }
});
exports.default = handleInvoicePaymentSucceeded;
