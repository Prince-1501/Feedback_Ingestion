const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/db', { 
    useNewUrlParser: true,
    useUnifiedTopology: true });

// Create Feedback schema
const feedbackSchema = new mongoose.Schema({
    post_id:{
        type: String
    },
    feedback_type: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true,
        enum: ['intercom', 'twitter', 'playstore', 'discourse', 'other']
    },
    source_id: {
        type: String,
        required: true
    },
    metadata: {
        type: Map,
        of: String
    },
    language: {
        type: String,
        required: true
    },
    tenant_info: {
        type: String,
        required: true
    },
    tenant_id: {
        type: String
    },
    topic_id:{
        type: String,
    },
    hash: { 
        type: String, 
        unique: true, 
        required: true 
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = { Feedback };
