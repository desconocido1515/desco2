import fetch from 'node-fetch'

const handler = async (m, { conn, command, text, isAdmin }) => {
    if (!isAdmin) throw '👑 *Solo un administrador puede ejecutar este comando*'

    // Obtener el usuario objetivo
    let target = m.quoted?.sender || m.mentionedJid?.[0] || text
    if (!target) return conn.sendMessage(m.chat, '❗ *Menciona a la persona que deseas mutear/desmutear*', m)

    // Validaciones
    const botOwner = global.owner?.[0]?.[0] + '@s.whatsapp.net'
    if (target === botOwner) throw '😼 *El creador del bot no puede ser mutado*'
    if (target === conn.user.jid) throw '❌ *No puedes mutar el bot*'

    // Inicializar usuario en base de datos si no existe
    if (!global.db.data.users[target]) global.db.data.users[target] = { muted: false }
    let userData = global.db.data.users[target]

    if (command.toLowerCase() === 'mute') {
        if (userData.muted) throw '😼 *Este usuario ya ha sido mutado*'

        // Mensaje de confirmación con imagen
        const msg = {
            key: {
                participants: '0@s.whatsapp.net',
                fromMe: false,
                id: 'mute-message'
            },
            message: {
                locationMessage: {
                    name: 'Usuario mutado',
                    jpegThumbnail: await (await fetch('https://telegra.ph/file/f8324d9798fa2ed2317bc.png')).buffer(),
                    vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Muted;;;\nFN:Muted\nEND:VCARD'
                }
            },
            participant: '0@s.whatsapp.net'
        }

        userData.muted = true
        return conn.sendMessage(m.chat, '✅ *Usuario mutado correctamente*', msg, { mentions: [target] })
    }

    if (command.toLowerCase() === 'unmute') {
        if (!userData.muted) throw '😼 *Este usuario no ha sido mutado*'

        const msg = {
            key: {
                participants: '0@s.whatsapp.net',
                fromMe: false,
                id: 'unmute-message'
            },
            message: {
                locationMessage: {
                    name: 'Usuario desmutado',
                    jpegThumbnail: await (await fetch('https://telegra.ph/file/aea704d0b242b8c41bf15.png')).buffer(),
                    vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Unmuted;;;\nFN:Unmuted\nEND:VCARD'
                }
            },
            participant: '0@s.whatsapp.net'
        }

        userData.muted = false
        return conn.sendMessage(m.chat, '✅ *Usuario desmutado correctamente*', msg, { mentions: [target] })
    }
}

handler.command = /^(mute|unmute)$/i
handler.rowner = false
handler.group = true
handler.botAdmin = true
export default handler
