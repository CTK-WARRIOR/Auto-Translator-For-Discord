const fs = require("fs")
const lang = require("../storage/lang.json")
const { base_lang } = require("../config.json")

module.exports = (message, args) => {
	const savedData = JSON.parse(fs.readFileSync("./storage/database.json", "utf8"))
	if(savedData[message.author.id]) {
		delete savedData[message.author.id]
		message.reply("I disabled auto translation, now your message won't be translated by bot.")
	} else {
		if(!args[0]) return message.reply("`❌ You need to provide the language which you speak.`")
	    let language = Object.keys(lang).find(x => x.toLowerCase() === args[0].toLowerCase() || lang[x].name.toLowerCase() === args[0].toLowerCase())
        if(!language || language === base_lang) return message.reply("`❌ Given langauge do not exist in my data.`")

        savedData[message.author.id] = language
        message.reply("I enbaled auto translation for you, now your message will be translated by bot.")
	}

    fs.writeFileSync("./storage/database.json", JSON.stringify(savedData, null, 2), (err) => {
          if (err) console.log(err)
    });
}