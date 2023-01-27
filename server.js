var express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy;

const feedback =  require('./schema/feedbackSchema');
const transformFeedbackData = require('./helper/feedback_helper');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

/* ---------------- Feedback service is working ---------------- */

// Use passport to authenticate tenants
passport.use(new BasicStrategy((username, password, done) => {
  // Verify tenant credentials
  if (username === 'company1' && password === 'password') {  /* We can also Implement a Separate Database for this Tenants or Users */
      return done(null, { id: username });
  } else {
      return done(null, false);
  }
}));

// Store the Feedback
app.post('/feedback', passport.authenticate('basic', { session: false }), async(req,res)=>{
  try{
    const feedbackData = req.body;
    feedbackData.tenant_id = req.user.id; /* Add the tenant's ID to the feedback data */
    
    /* Idempotency - check for duplicate feedback records before storing them */
    const existingRecord = await feedback.checkDuplicateFeedbackRecord(feedbackData);
    if(existingRecord.records ){
       res.status(200).send('Feedback already received');
       return;
    }
    feedbackData.hash = existingRecord.hashValue;
    
    const transformedData = await transformFeedbackData(feedbackData);
    await feedback.createFeedback(transformedData);
    res.status(200).send('Feedback received');
  }catch(err){
    res.status(401).send({ error: "Unauthorized" });
  }
});

/* Read the Feedback */
app.get('/feedback/:feedbackId', passport.authenticate('basic', { session: false }), async(req,res)=>{
  try{
    const feedbackId = req.params.feedbackId;
    const tenant_id = req.user.id;
    const data = await feedback.readFeedback(feedbackId, tenant_id);
    res.status(200).send(data);
  }catch(err){
    res.status(401).send({ error: err });
  }
});

app.get('/feedback/:topic_id/posts.json', passport.authenticate('basic', { session: false }), async(req, res)=>{
  try{
    const topic_id = req.params.topic_id;
    const post_ids = req.query.post_ids;
    const data = await feedback.findFeedbackByTopicID(topic_id, post_ids);
    res.status(200).send(data);
  }catch(err){
    res.status(401).send({ error: err });
  }
});

app.get('/feedback/query/search.json', passport.authenticate('basic', { session: false }), async(req, res)=>{
  try{
    const queryValue = req.query.q;
    const data = await feedback.findFeedbackByDate(queryValue);
    res.status(200).send(data);
  }
  catch(err){
    res.status(401).send({ error: err });
  }
});

/* ---------------- Service is up on the below PORT Number ---------------- */

var port = process.env.PORT || 3000;
app.listen(port,()=>{
  console.log(`server is up on port ${port}`);
});
