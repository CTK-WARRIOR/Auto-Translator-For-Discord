const discord = require("discord.js"),
      client = new discord.Client(),
      fs = require("fs"),
      config = require("./config.json")

const token = config.token

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

    console.log(`langs=${langsArr}`)
    console.log(`channels=${channelIdsArr}`)

    console.log("Translator Bot is connected to Discord.")
});

client.on("message", async (message) => {

    const messageChannelId = message.channel.id
    console.log(`messageChannelId=${messageChannelId}`);

    if (channelIdsArr.includes(messageChannelId)) {
        const messageChannel = client.channels.cache.get(messageChannelId);
        console.log(`messageChannel=${messageChannel}`);
        if(messageChannel) {
            const messageLang = langsArr[channelIdsArr.indexOf(messageChannelId)]
            console.log(`messageLang=${messageLang}`);

            const translateToChannels = channelIdsArr.filter(c => c !== messageChannelId)
            for (let i = 0 ; i < translateToChannels.length ; i++) {
                const langIndex = channelIdsArr.indexOf(translateToChannels[i])
                const channel = client.channels.cache.get(translateToChannels[i])
                const toLang = langsArr[langIndex]
                console.log(`channel=${channel}`);
                console.log(`toLang=${toLang}`);

                const translation = await Translator.autoTranslate(message, { from: messageLang, to: toLang});
                if(translation) return channel.send(translation)
            }
        }
    }
})

client.login(token)