const discord = require("discord.js"),
      client = new discord.Client(),
      fs = require("fs"),
      {token, prefix, base_lang} = require("./config.json")

let Translator = require("./translator.js");
Translator = new Translator()


client.on("ready", () => console.log("Translator Bot is connected to Discord."));

client.on("message", async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) {

      const savedData = JSON.parse(fs.readFileSync("./storage/database.json", "utf8"))
	  if(!savedData[message.author.id]) return;
	  const translation = await Translator.autoTranslate(message, { from: savedData[message.author.id], to: base_lang});
	  if(translation) return message.channel.send(translation)

    } else {

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
	if(command === "translate") return require("./commands/translate")(message, args)
    }
    
})

client.login(token)