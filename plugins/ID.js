import FormData from "form-data"
import fetch from "node-fetch"

const handler = async (m, { conn }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ""

    if (!mime) return m.reply(`❀ Por favor, envía o responde a una imagen con el comando.`)
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`✧ El formato (${mime}) no es compatible, usa JPG o PNG.`)

    conn.reply(m.chat, '*🚀 Mejorando imagen...*', m)

    const buffer = await q.download()
    const enhancedBuffer = await remini(buffer)

    await conn.sendFile(m.chat, enhancedBuffer, 'remini.jpg', '✨ Imagen mejorada con IA', m)

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `⚠️ Ocurrió un error: ${e.message}`, m)
  }
}

handler.help = ['reminis', 'hd', 'enhance']
handler.tags = ['tools']
handler.command = ['reminis', 'hd', 'enhance']
handler.group = false // cámbialo a true si solo quieres en grupos

export default handler

async function remini(imageBuffer, operation = "enhance") {
  const validOps = ["enhance", "recolor", "dehaze"]
  operation = validOps.includes(operation) ? operation : "enhance"

  const form = new FormData()
  form.append("image", imageBuffer, {
    filename: "image.jpg",
    contentType: "image/jpeg"
  })
  form.append("model_version", "1")

  const res = await fetch(`https://inferenceengine.vyro.ai/${operation}.vyro`, {
    method: "POST",
    body: form,
    headers: {
      ...form.getHeaders(),
      "User-Agent": "okhttp/4.9.3",
      "Accept-Encoding": "gzip"
    }
  })

  if (!res.ok) throw new Error("No se pudo procesar la imagen.")
  return await res.buffer()
}
