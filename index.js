const discord = require("discord.js"),
      client = new discord.Client(),
      fs = require("fs"),
      config = require("./config.json")

let Translator = require("./translator.js");
Translator = new Translator()

const langsArr = [];
const channelIdsArr = [];

client.on("ready", () => {
    const langs = Object.getOwnPropertyNames(config.channels)
    langs.forEach(lang => {
        const channelId = config.channels[lang]

        langsArr.push(lang)
        channelIdsArr.push(channelId)
    });

    console.log("Translator Bot is connected to Discord.")
});

client.on("message", async (message) => {

    const messageChannelId = message.channel.id

    if (channelIdsArr.has(messageChannelId)) {
        const messageChannel = client.channels.cache.get(messageChannelId);
        if(messageChannel) {
            const messageLang = langsArr[channelIdsArr.indexOf(messageChannelId)]

            const translateToChannels = channelIdsArr.filter(c => c !== messageChannelId)
            for (let i = 0 ; i < translateToChannels.length ; i++) {
                const langIndex = channelIdsArr.indexOf(translateToChannels[i])
                const channel = client.channels.cache.get(translateToChannels[i])
                const toLang = langsArr[langIndex]

                const translation = await Translator.autoTranslate(message, { from: messageLang, to: toLang});
                if(translation) return channel.send(translation)
            }
        }
    }
})

client.login(token)