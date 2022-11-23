({
    doInit:  function(cmp, evt, helper) {
        helper.rehydrateMessagesFromCache(cmp);
    },

    onNewMessage: function(cmp, evt, helper) {
        var content = evt.getParam('content');
        cmp.set("v.currentmessage",content);
        helper.translateText(cmp,'en',false);
     },
    
    onAgentSend: function(cmp, evt, helper) {
        var content = evt.getParam("content");
        cmp.set("v.currentmessage",content);
        let messages = cmp.get("v.clientMessages");
        let message = {original : cmp.get("v.currentmessage"),translated : null,isAgent:true}
        messages.push(message);
        helper.updateCache(cmp,messages);
        cmp.set("v.clientMessages",messages);
    }
})