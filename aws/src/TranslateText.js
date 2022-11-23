const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const translate = new AWS.Translate();

exports.handler = async (event) => {
    console.log("event==",event);
    const {text,sourceLanguage,targetLanguage} = JSON.parse(event.body);
    /*
    {
       "Settings": { 
          "Formality": "string",
          "Profanity": "string"
       },
       "SourceLanguageCode": "string",
       "TargetLanguageCode": "string",
       "TerminologyNames": [ "string" ],
       "Text": "string"
    }*/
    var params = {
        SourceLanguageCode: sourceLanguage,
        TargetLanguageCode: targetLanguage,
        Text: text
    }

    const translation = await translate.translateText(params).promise();
    console.log(translation);
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(translation),
    };
    return response;
};
