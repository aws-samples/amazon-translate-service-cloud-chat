try {
    String original = 'Hello, this is a test of the translation service';
    String translation = TranslationSnapinCtrl.translate(original, 'auto', 'es');
    TranslationSnapinCtrl.AWSTranslateResponse result = (TranslationSnapinCtrl.AWSTranslateResponse)JSON.deserialize(translation, TranslationSnapinCtrl.AWSTranslateResponse.class);
    System.debug(System.LoggingLevel.INFO,'***    Original Text   *** ' + original);
    System.debug(System.LoggingLevel.INFO,'*** Translation Result *** ' + result.TranslatedText);
} catch (Exception e) {
    System.debug(System.LoggingLevel.ERROR,e.getMessage());
}
