const express = require('express');
const { MongoClient } = require('mongodb')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // <
const User = require('./models/user.js')




const url = 'mongodb://127.0.0.1:27017/'
const client = new MongoClient(url)
const dbName = 'mydb'
const app = express();

app.use(express.json());



async function main() {
    await client.connect()
    console.log('✅ MongoDB ulandi')
    const db = client.db(dbName)
    const users = db.collection('users')

    app.get('/', async (req, res) => {
        const allUsers = await users.find().toArray()
        res.json(allUsers)
    })

    app.listen(3000, () => {
        console.log('Server http://localhost:3000 da ishlayapti')
    })

    app.post('/user/add', async (req, res) => {
        try {
            console.log("adddd");
            const user = new User(req.body)  // ✅ bu yerda katta "U" bilan User ishlatilgan
            await user.save()
            res.status(201).json(user)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    })

    app.get('/.well-known/assetlinks.json', (req, res) => {
        fs.readFile('assetlinks.json', 'utf8', (err, jsonData) => {
            if (err) {
                return res.status(500).json({ error: "Json parse qilihda xatolik" });
            }
            try {
                const data = JSON.parse(jsonData);
                res.json(data);
            }
            catch (parseErr) {
                res.status(500).json({ err: "Responseda xatolik bor" });
            }
        });
    });
}

<<<<<<< HEAD
main().catch(console.error)
=======
});
app.get('/api/quote', (req, res) => {
    fs.readFile('db/quotes/quotes.json', 'utf8', (err, jsonData) => {
        if (err) {
            return res.status(500).json({ error: 'Faylni o‘qishda xatolik' });
        }

        try {
            const data = JSON.parse(jsonData);
            res.json(data["data"][getRandomInt(0, data["data"].length-1)]);
        } catch (parseErr) {
            res.status(500).json({ error: 'JSON faylni tahlil qilishda xatolik' });
        }
    });

});
app.post('/api/like', (req, res) => {
    const targetId = parseInt(req.query["id"]);

    fs.readFile('db/quotes/quotes.json', 'utf8', (err, jsonData) => {
        if (err) return res.status(500).json({ error: 'Faylni o‘qib bo‘lmadi' });

        try {
            const obj = JSON.parse(jsonData);
            const item = obj.data.find(entry => entry.id === targetId);

            if (!item) return res.status(404).json({ error: `id ${targetId} topilmadi` });

            item.like += 1;

            fs.writeFile('db/quotes/quotes.json', JSON.stringify(obj, null, 2), (writeErr) => {
                if (writeErr) return res.status(500).json({ error: 'Yozishda xatolik' });

                res.json({ message: `id ${targetId} uchun like qo‘shildi`, like: item.like });
            });
        } catch {
            res.status(500).json({ error: 'JSON formatda xatolik bor' });
        }
    });
});

app.post('/api/add', (req, res) => {
    const { quote, author } = req.body;

    if (!quote || !author) {
        return res.status(400).json({ error: 'quote va author bo‘lishi kerak' });
    }

    fs.readFile('db/quotes/quotes.json', 'utf8', (err, jsonData) => {
        if (err) return res.status(500).json({ error: 'Faylni o‘qib bo‘lmadi' });

        try {
            const obj = JSON.parse(jsonData);

            // 🔥 Oxirgi elementni topamiz va id ni oshiramiz
            const lastItem = obj.data[obj.data.length - 1];
            const newId = lastItem ? lastItem.id + 1 : 0;

            const newItem = {
                id: newId,
                quote,
                author,
                like: 0
            };

            obj.data.push(newItem);

            fs.writeFile('db/quotes/quotes.json', JSON.stringify(obj, null, 2), (err) => {
                if (err) return res.status(500).json({ error: 'Yozishda xatolik' });

                res.status(201).json({ message: 'Yangi quote qo‘shildi', data: newItem });
            });

        } catch {
            res.status(500).json({ error: 'JSON format xato' });
        }
    });
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
>>>>>>> 0f3b14c78cbc9b71407b8b6cd373f7702bfd5ce5
