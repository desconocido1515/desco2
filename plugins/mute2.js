/** By @MoonContentCreator || Adaptado para soporte de mención o respuesta **/
import fetch from 'node-fetch';

const handler = async (m, { conn, command, text, isAdmin, isBotAdmin }) => {
    if (!isBotAdmin) return m.reply('⚠️ *El bot necesita ser admin*');
    if (!isAdmin) return m.reply('⚠️ *Solo admins pueden usar este comando*');

    // Extraemos al usuario a mutear/desmutear: primero mención, luego respuesta, luego texto
    let user = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : text);
    if (!user) return m.reply('╰⊱❗️⊱ *Menciona o responde al usuario que deseas mutar* ⊱❗️⊱╮');

    // Evitamos mutear al bot o al creador
    const botJid = conn.user.jid;
    const ownerJid = global.owner[0][0] + '@s.whatsapp.net';
    if (user === botJid) return m.reply('❌️ *No puedes mutar al bot*');
    if (user === ownerJid) return m.reply('😼 *El creador del bot no puede ser mutado*');

    // Obtenemos registro del usuario en la base de datos
    if (!global.db) global.db = {};
    if (!global.db.users) global.db.users = {};
    if (!global.db.users[user]) global.db.users[user] = { muted: false };

    const userData = global.db.users[user];

    if (command.toLowerCase() === 'mute') {
        if (userData.muted) return m.reply('😼 *Este usuario ya ha sido muteado*');

        userData.muted = true;

        await conn.sendMessage(m.chat, {
            text: `*ORDENES RECIBIDAS* ☑️\n\nSilenciaré a *@${user.split('@')[0]}*`,
            mentions: [user]
        }, { quoted: m });

    } else if (command.toLowerCase() === 'unmute') {
        if (!userData.muted) return m.reply('😼 *Este usuario no ha sido muteado*');

        userData.muted = false;

        await conn.sendMessage(m.chat, {
            text: `*ORDENES RECIBIDAS* ☑️\n\n*@${user.split('@')[0]}* fuiste desmuteado.`,
            mentions: [user]
        }, { quoted: m });
    }
};

// Anti-mensajes de usuarios muteados
handler.before = async (m, { conn }) => {
    if (global.db?.users?.[m.sender]?.muted && !m.key.fromMe) {
        try {
            await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id } });
        } catch (e) {
            console.log(e);
        }
        return false; // Evita que otros handlers procesen el mensaje
    }
};

handler.help = ['mute @usuario', 'mute (responder)', 'unmute @usuario', 'unmute (responder)'];
handler.tags = ['moderación'];
handler.command = /^(mute|unmute)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
