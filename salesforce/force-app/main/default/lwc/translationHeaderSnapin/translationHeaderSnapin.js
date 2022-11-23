import BaseChatHeader from 'lightningsnapin/baseChatHeader';
import chatMessageBus from '@salesforce/messageChannel/chatMessageBus__c';
import { publish, MessageContext } from 'lightning/messageService';
import { wire } from 'lwc';

import LANG from '@salesforce/i18n/lang';

export default class TranslationHeaderSnapin extends BaseChatHeader {
    /**
     * Text to display in h2 element.
     * @type {string}
     */
    text;
    language;

    @wire(MessageContext)
    messageContext;

    /**
     * Set handlers for events from the sidebar.
     */
    connectedCallback() {
        this.language = LANG || navigator.language;
        this.language = this.language.substring(0,2); //just the language, not the country
        sessionStorage.setItem("msl-chat-language",this.language);
        this.assignHandler("prechatState", (data) => {
            this.setText(data.label);
        });
        this.assignHandler("offlineSupportState", (data) => {
            this.setText(data.label);
        });
        this.assignHandler("waitingState", (data) => {
            this.setText(data.label);
        });
        this.assignHandler("waitingEndedState", (data) => {
            this.setText(data.label);
        });
        this.assignHandler("chatState", (data) => {
            this.setText(data.label);
        });
        this.assignHandler("chatTimeoutUpdate", (data) => {
            this.setText("You will time out soon.");
        });
        this.assignHandler("chatTimeoutClear", (data) => {
            this.setText(data.label);
        });
        this.assignHandler("chatEndedState", (data) => {
            this.setText(data.label);
        });
        this.assignHandler("reconnectingState", (data) => {
            this.setText(data.label);
        });
        this.assignHandler("postchatState", (data) => {
            this.setText(data.label);
        });
        this.assignHandler("chatConferenceState", (data) => {
            this.setText(data.label);
        });
    }
    
    renderedCallback() {
        this.template.querySelector(".language").value = this.language;
        this.template.querySelector(".language").focus();
    }

    changeLanguage(event) {
        const payload = { languageSelected: event.target.value };
        sessionStorage.setItem("msl-chat-language",event.target.value);
        publish(this.messageContext, chatMessageBus, payload);
    }

    setText(str) {
        if (typeof str !== "string") {
            throw new Error("Expected text value to be a `String` but received: " + str + ".");
        }
        this.text = str;
    }
}