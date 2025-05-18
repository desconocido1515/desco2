const handler = async (m, { conn }) => {
  console.log("✅ Comando .remini detectado")
  await conn.reply(m.chat, 'Hola! El comando *remini* está funcionando correctamente.', m)
}

handler.command = ['reminis', 'hd']
handler.help = ['reminis']
handler.tags = ['test']

export default handler
