const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

// 🔧 DEINE IDs
const CLIENT_ID = "1518325123592228954";
const GUILD_ID = "1517980192067289170";

const commands = [
    new SlashCommandBuilder()
        .setName("gewinner")
        .setDescription("Gewinner eintragen"),

    new SlashCommandBuilder()
        .setName("race")
        .setDescription("Race erstellen"),

    new SlashCommandBuilder()
        .setName("wette")
        .setDescription("Wette erstellen"),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Registriere Slash Commands...");

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );

        console.log("✅ Commands erfolgreich registriert!");
    } catch (error) {
        console.error("Fehler:", error);
    }
})();
