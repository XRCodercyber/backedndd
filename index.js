const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // <


const app = express();

const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Iqtibos backend');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.get('/api/quotes', (req, res) => {
    fs.readFile('db/quotes/quotes.json', 'utf8', (err, jsonData) => {
        if (err) {
            return res.status(500).json({ error: 'Faylni o‘qishda xatolik' });
        }

        try {
            const data = JSON.parse(jsonData);
            res.json(data);
        } catch (parseErr) {
            res.status(500).json({ error: 'JSON faylni tahlil qilishda xatolik' });
        }
    });

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
