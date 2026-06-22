require("dotenv").config();

const { Client, GatewayIntentBits, Events,
    ModalBuilder, TextInputBuilder, TextInputStyle,
    ActionRowBuilder, EmbedBuilder } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// ================== CHANNEL IDS ==================
const CHANNEL_GEWINNER = "1518162583855562852";
const CHANNEL_RACE = "1518633087079157972";
const CHANNEL_WETTE = "1518633042409685223";
// ===============================================

client.once("ready", () => {
    console.log(`Online als ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {

    const channel = await client.channels.fetch(
        interaction.commandName === "gewinner"
            ? CHANNEL_GEWINNER
            : interaction.commandName === "race"
                ? CHANNEL_RACE
                : CHANNEL_WETTE
    ).catch(() => null);

    // ================= /GEWINNER =================
    if (interaction.isChatInputCommand() && interaction.commandName === "gewinner") {

        const modal = new ModalBuilder()
            .setCustomId("gewinnerModal")
            .setTitle("Gewinner");

        const cup = new TextInputBuilder()
            .setCustomId("cup")
            .setLabel("Name des Cups")
            .setStyle(TextInputStyle.Short);

        const p1 = new TextInputBuilder().setCustomId("p1").setLabel("Platz 1").setStyle(TextInputStyle.Short).setRequired(false);
        const p2 = new TextInputBuilder().setCustomId("p2").setLabel("Platz 2").setStyle(TextInputStyle.Short).setRequired(false);
        const p3 = new TextInputBuilder().setCustomId("p3").setLabel("Platz 3").setStyle(TextInputStyle.Short).setRequired(false);

        return interaction.showModal(
            modal.addComponents(
                new ActionRowBuilder().addComponents(cup),
                new ActionRowBuilder().addComponents(p1),
                new ActionRowBuilder().addComponents(p2),
                new ActionRowBuilder().addComponents(p3),
            )
        );
    }

    // ================= /RACE =================
    if (interaction.isChatInputCommand() && interaction.commandName === "race") {

        const modal = new ModalBuilder()
            .setCustomId("raceModal")
            .setTitle("Race");

        const name = new TextInputBuilder()
            .setCustomId("name")
            .setLabel("Name des Cups")
            .setStyle(TextInputStyle.Short);

        const prize = new TextInputBuilder()
            .setCustomId("prize")
            .setLabel("Preisgeld")
            .setStyle(TextInputStyle.Short);

        const date = new TextInputBuilder()
            .setCustomId("date")
            .setLabel("Datum")
            .setStyle(TextInputStyle.Short);

        return interaction.showModal(
            modal.addComponents(
                new ActionRowBuilder().addComponents(name),
                new ActionRowBuilder().addComponents(prize),
                new ActionRowBuilder().addComponents(date),
            )
        );
    }

    // ================= /WETTE =================
    if (interaction.isChatInputCommand() && interaction.commandName === "wette") {

        const modal = new ModalBuilder()
            .setCustomId("wetteModal")
            .setTitle("Wette");

        const name = new TextInputBuilder()
            .setCustomId("name")
            .setLabel("Name")
            .setStyle(TextInputStyle.Short);

        const amount = new TextInputBuilder()
            .setCustomId("amount")
            .setLabel("Wie viel")
            .setStyle(TextInputStyle.Short);

        const onwhat = new TextInputBuilder()
            .setCustomId("onwhat")
            .setLabel("Auf was")
            .setStyle(TextInputStyle.Short);

        return interaction.showModal(
            modal.addComponents(
                new ActionRowBuilder().addComponents(name),
                new ActionRowBuilder().addComponents(amount),
                new ActionRowBuilder().addComponents(onwhat),
            )
        );
    }

    // ================= MODALS =================
    if (!interaction.isModalSubmit()) return;

    let targetChannel = null;

    if (interaction.customId === "gewinnerModal") targetChannel = CHANNEL_GEWINNER;
    if (interaction.customId === "raceModal") targetChannel = CHANNEL_RACE;
    if (interaction.customId === "wetteModal") targetChannel = CHANNEL_WETTE;

    const channelSend = await client.channels.fetch(targetChannel).catch(() => null);
    if (!channelSend) return;

    // -------- GEWINNER --------
    if (interaction.customId === "gewinnerModal") {

        const embed = new EmbedBuilder()
            .setTitle(`Gewinner ${interaction.fields.getTextInputValue("cup")}`)
            .addFields(
                { name: "Platz 1", value: interaction.fields.getTextInputValue("p1") || "-" },
                { name: "Platz 2", value: interaction.fields.getTextInputValue("p2") || "-" },
                { name: "Platz 3", value: interaction.fields.getTextInputValue("p3") || "-" },
            );

        await channelSend.send({ embeds: [embed] });
        return interaction.reply({ content: "Gesendet", ephemeral: true });
    }

    // -------- RACE --------
    if (interaction.customId === "raceModal") {

        const embed = new EmbedBuilder()
            .setTitle(interaction.fields.getTextInputValue("name"))
            .addFields(
                { name: "Preisgeld", value: interaction.fields.getTextInputValue("prize") },
                { name: "Datum", value: interaction.fields.getTextInputValue("date") },
            );

        await channelSend.send({ embeds: [embed] });
        return interaction.reply({ content: "Gesendet", ephemeral: true });
    }

    // -------- WETTE --------
    if (interaction.customId === "wetteModal") {

        const embed = new EmbedBuilder()
            .setTitle("Wette")
            .addFields(
                { name: "Name", value: interaction.fields.getTextInputValue("name") },
                { name: "Wie viel", value: interaction.fields.getTextInputValue("amount") },
                { name: "Auf was", value: interaction.fields.getTextInputValue("onwhat") },
            );

        await channelSend.send({ embeds: [embed] });
        return interaction.reply({ content: "Gesendet", ephemeral: true });
    }
});

client.login(process.env.TOKEN);
