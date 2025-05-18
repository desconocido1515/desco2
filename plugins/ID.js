import FormData from "form-data"
import fetch from "node-fetch"

const handler = async (m, { conn }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ""

    if (!mime) {
      return m.reply(`❀ Por favor, envía o responde a una imagen con el comando.`)
    }

    if (!/image\/(jpe?g|png)/.test(mime)) {
      return m.reply(`✧ El formato del archivo (${mime}) no es compatible, usa JPG o PNG.`)
    }

    conn.reply(m.chat, '*🚀 P R O C E S A N D O ...*', m)

    const imgBuffer = await q.download()
    const enhancedBuffer = await enhanceWithVyro(imgBuffer)

    await conn.sendFile(m.chat, enhancedBuffer, 'hd.jpg', '✨ Imagen mejorada con IA', m)

  } catch (error) {
    console.error(error)
    return conn.reply(m.chat, `⚠︎ Ocurrió un error: ${error.message}`, m)
  }
}

handler.help = ['remini']
handler.tags = ['tools']
handler.command = ['remini', 'hd', 'enhance']
handler.group = false

export default handler

async function enhanceWithVyro(buffer, operation = 'enhance') {
  const validOperations = ['enhance', 'recolor', 'dehaze']
  operation = validOperations.includes(operation) ? operation : 'enhance'

  const form = new FormData()
  form.append('image', buffer, {
    filename: 'image.jpg',
    contentType: 'image/jpeg'
  })
  form.append('model_version', '1')

  const res = await fetch(`https://inferenceengine.vyro.ai/${operation}.vyro`, {
    method: 'POST',
    body: form,
    headers: {
      ...form.getHeaders(),
      'User-Agent': 'okhttp/4.9.3',
      'Accept-Encoding': 'gzip'
    }
  })

  if (!res.ok) throw new Error('No se pudo procesar la imagen. El servidor falló.')
  return await res.buffer()
}
