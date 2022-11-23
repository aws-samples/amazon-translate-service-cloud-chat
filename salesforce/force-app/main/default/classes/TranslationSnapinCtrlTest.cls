@isTest
public class TranslationSnapinCtrlTest {
    
    public static testmethod void testTranslationServiceCallout() {
      
        Test.setMock(HttpCalloutMock.class, new TranslationSnapinCtrlMock());
        Test.startTest();

        String response = TranslationSnapinCtrl.translate('Hola', 'es', 'en');
        System.debug(response);
        System.assertEquals('{"TranslatedText":"Hello","SourceLanguageCode":"es","TargetLanguageCode":"en"}', response);

        Test.stopTest();
    }
}