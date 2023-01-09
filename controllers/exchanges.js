// below throws error, but we will be attaching it to a MongoDB later, so leave it
const Users = require('../models/Users');
const Exchange = require('../models/Exchanges');
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
      const user = await Users.findOne({firebase: receivedId});
      if (user) {
        const bod = req.body;
        const userText = bod.data.text;
        console.log(userText);
 
        console.log(bod);

        const configuration = new Configuration({
          apiKey: process.env.OPEN_API_KEY,
        });
        //I believe that my OpenAI settings should automatically limit the length of user input allowed, but I should check on this so users don't try to submit long documents. 

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
        const s3_url = await speech.data.url;
        console.log(s3_url);
        console.log('message has been created!');

        res.status(200).json({
          message: 'Success!',
          s3: s3_url,
        });
        const message = Exchange.create({
          firebase: receivedId,
          userSpeech: userText, 
          hunterSpeech: hunterText,
          category: "conversation",
          s3_url: s3_url,
        });
      }
      if (!user) {
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
    
      console.log('receivedId ' + receivedId);

      const user = await Users.findOne({firebase: receivedId});
      console.log(user);

      if (user) {
        const oldDate = user.lastDate; //29
        const newDate =  new Date().getDate(); //31
        const count = user.counter;
        console.log(count);
        //if same day, check rate limiting counter, increment by one
        if (newDate - oldDate < 1) {
          if (count >=30) {
            res.status(500).json('You are out of requests for today, please come back tomorrow');
          }
          else {
            await user.update({$inc: {counter: 1}});
          }
        }
        //if it's been more than a day, reset lastDate and counter in user model
        if (newDate - oldDate >=1) {
          const dateReset = newDate();
          await user.update({lastDate: newDate});
          await user.update({counter: 0});
        }
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

        // console.log(hunterText);
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
          firebase: receivedId,
          userSpeech: newsString, 
          hunterSpeech: hunterText,
          category: "news",
          s3_url: s3_url,
        });
      }
      if (!user) {
        res.status(500).json('You must be logged in to access the hunterbotAPI. Contact us if you believe there is an error');
      }
    } catch (err) {
      console.log(err);
    }
  },
};
