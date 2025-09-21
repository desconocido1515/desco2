let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, text, isAdmin, isBotAdmin }) => {
    if (!isBotAdmin) return m.reply('⚠️ *El bot necesita ser admin*');
    if (!isAdmin) return m.reply('⚠️ *Solo admins pueden usar este comando*');

    let user = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null);
    if (!user) throw `❌ *Menciona o responde al usuario*\nEjemplo: *${usedPrefix + command} @usuario*`;

    const isMute = command.toLowerCase() === 'mute';
    const isUnmute = command.toLowerCase() === 'unmute';

    if (isMute) {
        mutedUsers.add(user);
        await conn.sendMessage(m.chat, {
            text: `*ORDENES RECIBIDAS* ☑️\n\nSilenciaré a *@${user.split('@')[0]}*`,
            mentions: [user]
        }, { quoted: m });
    } 
    else if (isUnmute) {
        mutedUsers.delete(user);
        await conn.sendMessage(m.chat, {
            text: `*ORDENES RECIBIDAS* ☑️\n\n*@${user.split('@')[0]}* fuiste desmuteado.`,
            mentions: [user]
        }, { quoted: m });
    }
};

// Anti-mensajes de usuarios muteados
handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender) && !m.key.fromMe) {
        try {
            await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id } });
        } catch (e) {
            console.log(e);
        }
        return false; // Evita que otros handlers procesen el mensaje
    }
};

handler.help = ['mute @usuario', 'unmute @usuario'];
handler.tags = ['moderación'];
handler.command = /^(mute|unmute)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
