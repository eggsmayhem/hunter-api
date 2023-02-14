// below throws error, but we will be attaching it to a MongoDB later, so leave it
const Users = require('../models/Users');
const Exchange = require('../models/Exchanges');
const { Configuration, OpenAIApi, } = require('openai');
const axios = require('axios');


module.exports = {
  helloWorld: async (req, res) => {
    try {
      res.send(200).json('Welcome to the hunterbot API!')
    }
    catch(err) {
      console.log(err)
    }
  },
  speakToHunter: async (req, res) => {
    try {
        console.log(req.body);
        const userText = await req.body.text;
        console.log(userText);
        const configuration = new Configuration({
          apiKey: process.env.OPEN_API_KEY,
        });
        //I believe that my OpenAI settings should automatically limit the length of user input allowed, but I should check on this so users don't try to submit long documents.  Max_tokens likely handles this? 
     

        const openai = new OpenAIApi(configuration);
        const result = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt: `The following is a conversation between a human and journalist Hunter S Thompson. The AI speaks as though it is Hunter S Thompson. \nHuman: ${userText}\nAI:`,
          temperature: 0.9,
          max_tokens: 150,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0.6,
          stop: [' Human:', ' AI:'],
        });

        const hunterText = result.data.choices[0].text;
        console.log('this should be hunters response' + hunterText);

        const textToSpeech = {
          text: hunterText,
          voice: 'Joey',
        };

        console.log(hunterText);
        const speech = await axios.post(process.env.BUCKET_NAME, textToSpeech);
        const s3_url = await speech.data.url;
        console.log(s3_url);
        console.log('message has been created!');

        res.status(200).json({
          message: 'Success!',
          hunterText: hunterText,
          s3: s3_url,
        });
        
        const message = Exchange.create({
          userSpeech: userText, 
          hunterSpeech: hunterText,
          category: "conversation",
          s3_url: s3_url,
        });
      }
      catch (err) {
      console.log(err);
    }
  },
  getTheNews: async (req, res) => {
    console.log(req);
    try {
      // the req body will need text, the result will send the S3bcketURI, newstext if relevan
        const newskey = process.env.NEWS_API_KEY;
        const theNews = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${newskey}`);
        console.log(theNews.data.articles.length);
        const resultsAmount = await theNews.data.articles.length;
        const articleNum = Math.floor(Math.random() * resultsAmount);
        const newsArray = [theNews.data.articles[articleNum].title, theNews.data.articles[articleNum].description];
        console.log(typeof newsArray)

        const configuration = new Configuration({
          apiKey: process.env.OPEN_API_KEY,
        });

        const openai = new OpenAIApi(configuration);
        const result = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt: `The following is a conversation between a human and journalist Hunter S Thompson. The AI speaks as though it is Hunter S Thompson. \nHuman: What do you think about today's news, ${newsArray[0]}, ${newsArray[1]} \nAI:`,
          temperature: 0.9,
          max_tokens: 150,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0.6,
          stop: [' Human:', ' AI:'],
        });

        const hunterText = result.data.choices[0].text;
        console.log('this should be hunters response' + hunterText);

        const textToSpeech = {
          text: hunterText,
          voice: 'Joey',
        };

        const speech = await axios.post(process.env.BUCKET_NAME, textToSpeech);

        const s3_url = await speech.data.url;
        console.log(s3_url);
        res.status(200).json({
          message: 'Success!',
          s3: s3_url,
          newsArray,
          hunterText,
        });
        const newsString = newsArray.join(', ');

        const message = Exchange.create({
          userSpeech: newsString, 
          hunterSpeech: hunterText,
          category: "news",
          s3_url: s3_url,
        });
      }
      
     catch (err) {
      console.log(err);
    }
  },
};
