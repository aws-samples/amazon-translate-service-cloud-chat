public class TranslationSnapinCtrl {
    
    private class Params {
        String text;
        String sourceLanguage;  //'auto' will try to auto detect the language
        String targetLanguage;
        Params(String text, String sourceLanguage, String targetLanguage) {
            this.text = text;
            this.sourceLanguage = sourceLanguage;
            this.targetLanguage = targetLanguage;
        }
    }

    public class AWSTranslateResponse {
        public String TranslatedText;
        public String SourceLanguageCode;
        public String TargetLanguageCode;
    }

    @AuraEnabled
    public static String translate(String text, String sourceLanguage, String targetLanguage) {
        Http h = new Http();
        HttpRequest req = new HttpRequest();
        String url = 'callout:TranslateService';
        req.setEndpoint(url);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setBody(JSON.serialize(new Params(text,sourceLanguage, targetLanguage)));
        
        // Send the request, and return a response
        HttpResponse res = h.send(req);
        //System.debug('AWS Translate Response');
        //System.debug(res.getBody());
        //example response: {"TranslatedText":"Hello I need something","SourceLanguageCode":"es","TargetLanguageCode":"en"}
        return res.getBody();
    }

   
    
}
