const mongoose = require("mongoose");
const { Schema } = mongoose

const checklistSchema = Schema(
    {
        name: {type: String, required: true},
        tasks: [{
            type: Schema.Types.ObjectId,
            ref: 'Task'
        }]
    }
)

module.exports = mongoose.model("Checklist", checklistSchema)