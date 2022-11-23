@isTest
global class TranslationSnapinCtrlMock implements HttpCalloutMock {
    
    // Implement this interface method
    global HTTPResponse respond(HTTPRequest req) {
        // Optionally, only send a mock response for a specific endpoint
        // and method.
        System.assertEquals('callout:TranslateService/default/TranslateDemoService', req.getEndpoint());
        System.assertEquals('POST', req.getMethod());
        
        // Create a fake response
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody('{"TranslatedText":"Hello","SourceLanguageCode":"es","TargetLanguageCode":"en"}');
        res.setStatusCode(200);
        return res;
    }
}