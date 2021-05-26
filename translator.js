const translate = require('translatte'),
    emoji = require('node-emoji');
/**
 * Translator Class
 */
class Translator {
    /**
     * Translate message content to any langauge to desire
     * @param  {String} message      string that you wanted to get translate
     * @param  {String} options.from from which langauge the msg should be translated
     * @param  {String} options.to   to which langauge the msg should be translated
     */
    async translate(message, { from = "auto", to = "en" } = {}) {
    	let content = message;
        const UniqueWords = content.match(/<(@|a|#|:)(.*?)>/g) || []
        const UniqueIDs = []
        for (let key of UniqueWords) {
            const ID = key.match(/\d{10,}/g);
            if (!ID || !ID.length) continue;
            UniqueIDs.push({
                id: ID[0],
                key: key
            })
            content = content.replace(key, ID[0])
        }

        content = emoji.unemojify(content)
        let normalEmoji = content.match(/:(.*?):/g) || []
        
        for(let word of normalEmoji) {
        	const number = randomNumber(1000000, 9000000)
        	  UniqueIDs.push({
                id: number,
                key: word
            })
        	content = content.replace(word, number)
        }
  
        const translatedMsg = await translate(content.trim(), {
            from,
            to: to
        }).catch(err => {})

        if(!translatedMsg.from || translatedMsg.from.language.iso === to) return message;
        let newMessage = translatedMsg ? translatedMsg.text : false;
        if (!newMessage || newMessage.trim() === content.trim()) return message;
        for (let key of UniqueIDs) newMessage = newMessage.replace(key.id, key.key)
        newMessage = emoji.emojify(newMessage) 
        console.log({newMessage, content})
        return newMessage;
    }

  /**
   * Helps to auto translate message sent on channel with attachment
   * @param  {Object} message      
   * @param  {String} options.from 
   * @param  {String} options.to   
   */
    async autoTranslate(message, { from = "auto", to = "en" } = {}) {
        if (!message.content) return;
        const content = await this.translate(message.content, { from, to })
        if(!content || content === message.content) return;
        return { content: `\`${message.member.nickname ? message.member.nickname : message.author.username}:\` ${content}`, files: message.attachments.map(x => { return { attachment: x.proxyURL, name: x.name } }) }
    }
    
    /**
     * Send webhook on the channel for trans
     * @param  {Object} message    
     * @param  {Object} translation 
     */
}


/**
 * Get random number in range
 */
function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
} 


module.exports = Translator;