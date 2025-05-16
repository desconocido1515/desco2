

import fs from 'fs'

let timeout = 15000
let poin = 500

let handler = async (m, { conn, usedPrefix }) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {}
    let id = m.chat
    if (id in conn.tekateki) {
        conn.reply(m.chat, 'Todavía hay una pregunta sin responder en este chat', conn.tekateki[id][0])
        throw false
    }
    let tekateki = JSON.parse(fs.readFileSync(`./src/game/trivia.json`))
    let json = tekateki[Math.floor(Math.random() * tekateki.length)]
    let _clue = json.response
    let clue = _clue.replace(/[A-Za-z]/g, '_')
    let caption = `
ⷮ ${json.question}

» 𝗧𝗶𝗲𝗺𝗽𝗼: ${(timeout / 1000).toFixed(2)} segundos

💫 Responde a este mensaje con la letra de la opción correcta ✅
¡Tienes 15 segundos!
`.trim()
    conn.tekateki[id] = [
       await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(async () => {
            if (conn.tekateki[id]) await conn.reply(m.chat, `Se acabó el tiempo!\n*La respuesta es la opción:* ${json.response}`, conn.tekateki[id][0])
            delete conn.tekateki[id]
        }, timeout)
    ]
}

handler.help = ['trivia']
handler.tags = ['game']
handler.command = /^(opcion|opción)$/i

export default handler
