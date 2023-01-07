# hunter-api

This is the backend for Hunterbot, a GPT-3 bot voiced by Amazon Polly that gets information from the NewsAPI.


## Tech stack
This API is a very simple interface written in NodeJS/Express, using authentication with Google/Firebase, and storing information in MongoDB using Atlas. OpenAIs module allows for easy configuration of prompts. An article is selected randomly from a call to the day's news from NewsAPI, and this information is send to an AWS lambda function to be converted to speech using Amazon Polly and saved in an S3 bucket. The url is then returned in the response so that it can be played automatically on the front end to give the bot a "voice."

## Lessons Learned 

Lambda functions can be tricky to configure regarding CORS. This is a common issue, but ultimately is an indication of good security practices at AWS (although based on the volume of issues a web search reveals, AWS could perhaps benefit from a clearer user-interface regarding CORS settings, especially if they are attempting to present their services as an abstraction away from the need for complex server configurations). 
