const mongoose = require("mongoose");
const { Schema } = mongoose

const tasklistSchema = Schema(
    {
        name: {type: String, required: true},
        done: {type: Boolean, default: false},
        checklist: {
            type: Schema.Types.ObjectId,
            ref: 'Checklist',
            required: true
        },
    }
)

module.exports = mongoose.model("Task", tasklistSchema)