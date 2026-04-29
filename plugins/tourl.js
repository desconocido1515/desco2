import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  
  if (!mime) {
    return conn.reply(m.chat, `*[❗INFO❗] RESPONDA A UNA IMAGEN O VIDEO EL CUAL SERA CONVERTIDO A ENLACE*\n\n📌 *Ejemplo:*\nResponde a una imagen o video con el comando .tourl`, m, rcanal)
  }
  
  let media = await q.download()
  if (!media) {
    return conn.reply(m.chat, `❌ *ERROR*\n\nNo se pudo descargar el archivo. Intenta nuevamente.`, m, rcanal)
  }
  
  try {
    let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
    let link = await (isTele ? uploadImage : uploadFile)(media)
    await conn.reply(m.chat, `✨ *ENLACE GENERADO* ✨\n\n🔗 *URL:* ${link}\n📂 *Tipo:* ${mime.split('/')[1].toUpperCase()}\n\n⚡ *Elite Bot Global - Since 2023* ⚡`, m, rcanal)
  } catch (error) {
    console.error(error)
    await conn.reply(m.chat, `❌ *ERROR AL SUBIR*\n\nNo se pudo generar el enlace. Intenta con otro archivo o más tarde.\n\n💡 *Error:* ${error.message}`, m, rcanal)
  }
}

handler.help = ['tourl <reply image>']
handler.tags = ['sticker']
handler.command = /^(upload|tourl2)$/i

export default handler
