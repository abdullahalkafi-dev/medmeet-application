"use strict";
// export function formatDate(date: Date | null): string | null {
//   if (!date) return null;
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
//   return date.toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//   });
// }
function formatDate(date) {
    if (!date)
        return null;
    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Set to true if you want 12-hour format
    });
}
