const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const FormData = require('form-data');
const axios = require('axios');

const remini = async (imageBuffer, operation = "enhance") => {
    const validOperations = ["enhance", "recolor", "dehaze"];
    operation = validOperations.includes(operation) ? operation : "enhance";

    const form = new FormData();
    form.append('image', imageBuffer, {
        filename: 'image.jpg',
        contentType: 'image/jpeg'
    });
    form.append('model_version', '1');

    try {
        const { data } = await axios({
            method: 'post',
            url: `https://inferenceengine.vyro.ai/${operation}.vyro`,
            data: form,
            headers: {
                ...form.getHeaders(),
                'User-Agent': 'okhttp/4.9.3',
                'Accept-Encoding': 'gzip'
            },
            responseType: 'arraybuffer',
            timeout: 30000
        });

        return data;
    } catch (error) {
        console.error('API Remini Error:', error.message);
        throw new Error('No se pudo procesar la imagen.');
    }
};

let handler = async (m, { conn }) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';

        if (!/image\/(jpe?g|png)/.test(mime))
            return m.reply('*Responde a una imagen JPG o PNG con el comando*');

        await m.react('🔄');

        const imgStream = await downloadContentFromMessage(q, 'image');
        let buffer = Buffer.alloc(0);
        for await (const chunk of imgStream) buffer = Buffer.concat([buffer, chunk]);

        if (!buffer.length) throw 'Imagen vacía o no descargada.';

        const result = await remini(buffer);

        await conn.sendMessage(m.chat, {
            image: result,
            caption: '🖼️ *Imagen mejorada con tecnología HD*\n\n💡 Usa fotos con buena luz para mejores resultados\n\n🤖 *Azura Ultra 2.0*'
        }, { quoted: m });

        await m.react('✅');

    } catch (err) {
        console.error(err);
        await m.react('❌');
        m.reply(typeof err === 'string' ? err : '*Ocurrió un error al procesar la imagen.*');
    }
};

handler.command = /^(reminis|hd|enhance)$/i;
handler.help = ['reminis'].map(v => v + ' (responde a imagen)');
handler.tags = ['ai'];

module.exports = handler;
