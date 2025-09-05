const express = require('express');
const { MongoClient } = require('mongodb')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // <
const User = require('./models/user.js')
var cors = require('cors');



const url = 'mongodb://127.0.0.1:27017/'
const client = new MongoClient(url)
const dbName = 'mydb'
const app = express();

app.use(express.json());
app.use(cors());

main();

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

