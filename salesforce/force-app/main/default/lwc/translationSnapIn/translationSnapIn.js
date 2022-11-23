import BaseChatMessage from 'lightningsnapin/baseChatMessage';
import translate from '@salesforce/apex/TranslationSnapinCtrl.translate'
import { track, wire } from 'lwc';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import chatMessageBus from '@salesforce/messageChannel/chatMessageBus__c';

const CHAT_CONTENT_CLASS = 'chat-content';
const AGENT_USER_TYPE = 'agent';
const CHASITOR_USER_TYPE = 'chasitor';
const SUPPORTED_USER_TYPES = [AGENT_USER_TYPE, CHASITOR_USER_TYPE];

const STORAGE_PREFIX = 'msl100722-';

/**
 * Displays a chat message using the inherited api messageContent and is styled based on the inherited api userType and messageContent api objects passed in from BaseChatMessage.
 */
export default class ChatMessageDefaultUI extends BaseChatMessage {
    @track messageStyle = '';
    @track translatedText = '';
    @track selectedLanguage = '';
    @track sourceText = '';
    @track fromAgent = false;
    subscription = null;

    @wire(MessageContext)
    messageContext;

    isSupportedUserType(userType) {
        return SUPPORTED_USER_TYPES.some((supportedUserType) => supportedUserType === userType);
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
        this.selectedLanguage = sessionStorage.getItem("msl-chat-language");
        this.sourceText = this.messageContent.value;
        this.doTranslate();
    }

    doTranslate() {
        this.messageStyle = `${CHAT_CONTENT_CLASS} ${this.userType}`;

        if (this.selectedLanguage === 'off') {
            this.translatedText = this.sourceText;
            return;
        }
        if (!this.isSupportedUserType(this.userType)) {
            return;
        }
        if (this.userType === CHASITOR_USER_TYPE) {
            //don't translate the customer's text, just the agent's
            this.translatedText = this.sourceText;
            return;
        }
        if (this.userType === AGENT_USER_TYPE) {
            this.translatedText = '...';
            this.retrieveFromCache(this.sourceText).then(cachedValue => {
                if (cachedValue) {
                    this.translatedText = cachedValue;
                } else {
                    translate({text: this.sourceText, sourceLanguage: 'en', targetLanguage: this.selectedLanguage})
                        .then(result => {
                            let response = JSON.parse(result);
                            this.translatedText = response.TranslatedText;
                            this.insertIntoCache(this.messageContent.value, this.translatedText);
                        })
                        .catch(e => console.error(e))
                }
            });
        }
        
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                chatMessageBus,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    handleMessage(message) {
        this.selectedLanguage = message.languageSelected;
        this.doTranslate();
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    async digestMessage(message) {
        const msgUint8 = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async computeHash(message) {
        return await this.digestMessage(message);
    }

    insertIntoCache(message, translation) {
        this.computeHash(message).then(hash => {
            var key = STORAGE_PREFIX + this.selectedLanguage + hash;
            sessionStorage.setItem(key, translation);
        });
    }

    async retrieveFromCache(message) {
        var hash = await this.computeHash(message);
        var key = STORAGE_PREFIX + this.selectedLanguage + hash;
        return sessionStorage.getItem(key);
    }
}