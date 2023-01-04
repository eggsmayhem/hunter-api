// below throws error, but we will be attaching it to a MongoDB later, so leave it
// const User = require('../models/Users');
// const Exchanges = require('../models/Exchanges');
const { Configuration, OpenAIApi, } = require('openai');
const axios = require('axios');

module.exports = {
//   helloUser: async (req, res) => {
//     console.log(req.user);
//     try {
//       const receivedId = await req.params.uid;
//       // receivedID WAS received
//       console.log('receivedId ' + receivedId);
//       // const user = Users.findOne({firebase: receivedId});
//       // const verifyId = user.firebase;
//       const verifyId = 'W1UCiMBG6ogdRIoe5SivAwzGnba2';
//       if (receivedId === verifyId) {
//         // call with text from user to OpenAI
//         res.status(200).json('User verified!');
//         const openai = new OpenAIApi(configuration);
//         const result = await openai.createCompletion({
//           model: 'text-davinci-002',
//           prompt: `The following is a conversation between a human and journalist Hunter S Thompson. The AI speaks as though it is Hunter S Thompson. \nHuman: What do you think about today's news, ${newsArray[0]}, ${newsArray[1]} \nAI:`,
//           temperature: 0.9,
//           max_tokens: 150,
//           top_p: 1,
//           frequency_penalty: 0,
//           presence_penalty: 0.6,
//           stop: [' Human:', ' AI:'],
//         });

  //         const hunterText = result.data.choices[0].text;
  //         console.log('this should be hunters response' + hunterText);
  //         // end of openAI call
  //       }
  //     } catch (err) {
  //       res.status(500).json(err);
  //     }
  //   },
  speakToHunter: async (req, res) => {
    try {
      // the req body will need text, the result will send the S3bcketURI, newstext if relevant
      const receivedId = await req.params.uid;
      console.log(receivedId);
      // receivedID WAS received
      console.log('receivedId ' + receivedId);
      // const user = Users.findOne({firebase: receivedId});
      // const verifyId = user.firebase;
      const verifyId = 'W1UCiMBG6ogdRIoe5SivAwzGnba2';
      if (receivedId === verifyId) {
        const bod = req.body;
        const userText = bod.data.text;
        console.log(userText);
        // res.status(200).json("Success")
        console.log(bod);
        // res.status(200).json({
        //     message: "Success!",
        //     body: bod
        // })
        // do the thing
        // const body = await req.body;

        const configuration = new Configuration({
          apiKey: process.env.OPEN_API_KEY,
        });
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

        // console.log(hunterText);
        const speech = await axios.post(process.env.BUCKET_NAME, textToSpeech);
        // // console.log(postText + "butttt")
        const s3_url = await speech.data.url;
        console.log(s3_url);
        res.status(200).json({
          message: 'Success!',
          s3: s3_url,
        });
      }
      if (receivedId !== verifyId) {
        res.status(500).json('You must be logged in to access the hunterbotAPI. Contact us if you believe there is an error');
      }
    } catch (err) {
      console.log(err);
    }
  },
  getTheNews: async (req, res) => {
    try {
      // the req body will need text, the result will send the S3bcketURI, newstext if relevant
      const receivedId = await req.params.uid;
      console.log(receivedId);
      // receivedID WAS received
      console.log('receivedId ' + receivedId);
      // const user = Users.findOne({firebase: receivedId});
      // const verifyId = user.firebase;
      const verifyId = 'W1UCiMBG6ogdRIoe5SivAwzGnba2';
      if (receivedId === verifyId) {
        const newskey = process.env.NEWS_API_KEY;
        const theNews = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${newskey}`);
        console.log(theNews.data.articles.length);
        const resultsAmount = await theNews.data.articles.length;
        const articleNum = Math.floor(Math.random() * resultsAmount);
        const newsArray = [theNews.data.articles[articleNum].title, theNews.data.articles[articleNum].description];

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

        // console.log(hunterText);
        const speech = await axios.post(process.env.BUCKET_NAME, textToSpeech);
        // // console.log(postText + "butttt")
        const s3_url = await speech.data.url;
        console.log(s3_url);
        res.status(200).json({
          message: 'Success!',
          s3: s3_url,
          newsArray,
          hunterText,
        });
      }
      if (receivedId !== verifyId) {
        res.status(500).json('You must be logged in to access the hunterbotAPI. Contact us if you believe there is an error');
      }
    } catch (err) {
      console.log(err);
    }
  },
};
