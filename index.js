require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Events,
  ChannelType
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, (c) => {
  console.log(`✅ ${c.user.tag} ist online!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // /shadow command
  if (interaction.commandName === "shadow") {
    await interaction.reply({
      content: "⚙️ Shadow Setup startet...",
      ephemeral: true
    });

    const channels = [
      "lg-shadow-1",
      "lg-shadow-2",
      "lg-shadow-3"
    ];

    for (const name of channels) {
      const channel = await interaction.guild.channels.create({
        name,
        type: ChannelType.GuildText
      });

      await channel.send("LG Shadow");
    }

    await interaction.followUp("✅ Setup abgeschlossen!");
  }
});

client.login(process.env.TOKEN);
