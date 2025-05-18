let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return

  const botJid = conn.user.jid
  const botId = botJid.split('@')[0]
  const participants = m.messageStubParameters || []

  const fueAgregadoElBot = (
    (m.messageStubType === 20) ||
    (m.messageStubType === 27 && participants.includes(botJid))
  )

  if (!fueAgregadoElBot) return

  let botName = conn.user.name
  let audioPath = './Audios/presentacion1.mp3'

  let welcomeBotText = `🥇 ¡𝗛𝗢𝗟𝗔 𝗚𝗥𝗨𝗣𝗢!🥇  
¡Soy ${botName}, su nuevo asistente digital!  
━━━━━━━━━━━━━━━━━━━  
⚡ *Mis funciones :*  
▸  Descargar música/videos  
▸  Búsquedas en Google  
▸  Juegos y diversión  
▸  Generar imágenes con IA  
▸  Herramientas para Free Fire  
━━━━━━━━━━━━━━━━━━━  
📂 *Mis menús:*  
▸  .menu → *Menú general*  
▸  .menuimg → *Imágenes AI*  
▸  .menuhot → *Contenido hot*  
▸  .menuaudios → *Efectos*  
▸  .menujuegos → *Juegos grupales*  
▸  .menufreefire → *Free Fire tools*  
━━━━━━━━━━━━━━━━━━━  
©EliteBotGlobal 2023`

  // Enviar mensaje de texto
  await conn.sendMessage(m.chat, {
    text: welcomeBotText
  }, { quoted: m })

  // Enviar audio de presentación
  await conn.sendMessage(m.chat, {
    audio: { url: audioPath },
    mimetype: 'audio/mpeg',
    ptt: true
  }, { quoted: m })
}

export default handler
