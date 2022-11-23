({
    translateText : function(cmp,language,isAgent) {
        var action = cmp.get("c.translate");
        action.setParams({ text : cmp.get("v.currentmessage"),sourceLanguage:'auto',targetLanguage : language });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log(response.getReturnValue());
                var rsp = JSON.parse(response.getReturnValue());
                var messages = cmp.get("v.clientMessages");
                var message = { original : cmp.get("v.currentmessage"),
                            translated : rsp.TranslatedText,
                            detectedLanguage : rsp.SourceLanguageCode,
                        isAgent : isAgent }
                if (!isAgent) {
                    cmp.set("v.detectedLanguage",rsp.SourceLanguageCode);
                    cmp.set("v.languageKnown",true);
                    cmp.set("v.selectedLanguage",rsp.SourceLanguageCode);
                }
                messages.push(message);
                this.updateCache(cmp,messages);
                cmp.set("v.clientMessages",messages);

            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },

    updateCache : function(cmp,messages) {
        var recordId = cmp.get("v.recordId");
        var key = "MSL-CHAT-HISTORY-" + recordId;
        sessionStorage.setItem(key,JSON.stringify(messages));
    },

    rehydrateMessagesFromCache : function(cmp) {
        var recordId = cmp.get("v.recordId");
        var key = "MSL-CHAT-HISTORY-" + recordId;
        var messages = sessionStorage.getItem(key);
        if (messages) {
            cmp.set("v.clientMessages",JSON.parse(messages));
        }
    }
})