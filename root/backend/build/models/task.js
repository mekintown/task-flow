"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const constant_1 = require("../utils/constant");
const taskSchema = new mongoose_1.Schema({
    board: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
    },
    title: {
        type: String,
        required: true,
        minLength: 3,
    },
    description: {
        type: String,
    },
    priority: {
        type: String,
        enum: Object.values(constant_1.TASK_PRIORITY),
    },
    dueDate: {
        type: Date,
    },
}, {
    timestamps: true,
});
Object.assign(taskSchema.statics, {
    TASK_PRIORITY: constant_1.TASK_PRIORITY,
});
taskSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        var _a;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        returnedObject.id = (_a = returnedObject._id) === null || _a === void 0 ? void 0 : _a.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
taskSchema.index({ board: 1 });
const Task = mongoose_1.default.model("Task", taskSchema);
exports.default = Task;
