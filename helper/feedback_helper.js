// Helper function to extract source-specific metadata
const extractMetadata = (feedbackData) => {
    let metadata;
    switch (feedbackData.source) {
        case 'playstore':
            metadata = {
                app_version: feedbackData.metadata.app_version,
                user_id: feedbackData.metadata.user_id,
                rating: feedbackData.metadata.rating
            };
            break;
        case 'twitter':
            metadata = {
                country: feedbackData.metadata.country,
                user_handle: feedbackData.metadata.user_handle,
                tweet_id: feedbackData.metadata.tweet_id
            };
            break;
        case 'discourse':
            metadata = {
                avatar_template: feedbackData.avatar_template
            };
            break;
        default:
            metadata = {};
            break;
    }
    return metadata;
}

// Helper function to transform feedback data to a uniform internal structure
const transformFeedbackData = (feedbackData) => {
    let transformedData = {};
    transformedData.feedback_type = feedbackData.feedback_type; // e.g. review, conversation
    transformedData.feedback = feedbackData.feedback;
    transformedData.source = feedbackData.source;
    transformedData.source_id = feedbackData.source_id;
    transformedData.metadata = extractMetadata(feedbackData);
    transformedData.language = feedbackData.language;
    transformedData.tenant_info = feedbackData.tenant_info;
    transformedData.tenant_id = feedbackData.tenant_id;
    transformedData.post_id = feedbackData.post_id;
    transformedData.topic_id = feedbackData.topic_id;
    transformedData.hash = feedbackData.hash;
    transformedData.created_at = new Date();
    return transformedData;
}

module.exports = transformFeedbackData;