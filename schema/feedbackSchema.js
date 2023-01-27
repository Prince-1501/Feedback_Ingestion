const crypto = require('crypto');

const {Feedback} = require('../db');
const createFeedback = async (feedbackData) => {
    try {
        const feedback = new Feedback(feedbackData);
        await feedback.save();
    } catch (error) {
        console.log(error);
    }
};

const readFeedback = async (feedbackId, tenant_id) => {
    try {
        const feedback = await Feedback.find( { tenant_id, id: feedbackId });
        return feedback;
    } catch (error) {
        console.log(error);
    }
}

const findFeedbackByTopicID = async (topic_id, post_ids) => {
    try{
        let feedback;
        if(post_ids){
            feedback = await Feedback.find({
                topic_id,
                post_id: { $in: post_ids}
            })
        }else{
            feedback = await Feedback.find({ topic_id })
        }
        return feedback;
    }catch (error) {
        console.log(error);
    }
}

const findFeedbackByDate = async (queryValue) => {
    try{
        const decodedQueryValue = decodeURIComponent(queryValue);
        const match = decodedQueryValue.match(/(after):([^\s]+)\s(before):([^\s]+)/);
        const startDate = new Date(match[2]).toISOString();
        const endDate = new Date(match[4]).toISOString();
        const results = Feedback.find({
            created_at: {
                $gte: startDate,
                $lt: endDate
            }
        });
        return results;
    }catch (error) {
        console.log(error);
    }
}


/*
    Check if a record with the same identifier has already been stored
*/
const checkDuplicateFeedbackRecord = async (feedbackData) => {
    try{
        // Generate a unique identifier for the feedback record
        const hash = crypto.createHash('sha256').update(JSON.stringify(feedbackData)).digest('hex');
        const existingRecord = await Feedback.findOne({hash: hash});
        const data = {
            hashValue: hash,
            records: false
        }
        if (existingRecord){
            data.records = true;
        }
        return data;
    }catch (error) {
        console.log(error);
    }
}

module.exports = { 
    createFeedback, 
    readFeedback, 
    findFeedbackByTopicID, 
    findFeedbackByDate, 
    checkDuplicateFeedbackRecord 
};
