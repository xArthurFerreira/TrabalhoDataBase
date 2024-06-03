const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Configuração do banco de dados MySQL
const dbConfig = {
    host: 'localhost', // ou o endereço do seu servidor MySQL
    user: 'seu_usuario',
    password: 'sua_senha',
    database: 'seu_banco_de_dados'
};

app.use(express.json());

// Servir arquivos estáticos (como index.html)
app.use(express.static(path.join(__dirname)));

// Conexão com o banco de dados
const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados MySQL:', err);
        return;
    }
    console.log('Conexão bem sucedida com o banco de dados MySQL');
});

// Rota para cadastrar um novo usuário
app.post('/register', async (req, res) => {
    const { nome, email, idade, senha } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const sql = `INSERT INTO Usuarios (Nome, Email, Idade, Senha) VALUES (?, ?, ?, ?)`;
        connection.query(sql, [nome, email, idade, hashedPassword], (err, result) => {
            if (err) {
                console.error('Erro ao cadastrar o usuário:', err);
                res.status(500).send('Erro ao cadastrar o usuário.');
                return;
            }
            console.log('Usuário cadastrado com sucesso.');
            res.status(201).send('Usuário cadastrado com sucesso.');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao cadastrar o usuário.');
    }
});

// Rota para login de usuário
app.post('/login', async (req, res) => {
    const { nome, senha } = req.body;

    try {
        const sql = `SELECT * FROM Usuarios WHERE Nome = ?`;
        connection.query(sql, [nome], async (err, result) => {
            if (err) {
                console.error('Erro ao fazer login:', err);
                res.status(500).send('Erro ao fazer login.');
                return;
            }
            const user = result[0];

            if (user && await bcrypt.compare(senha, user.Senha)) {
                const token = jwt.sign({ id: user.Id }, 'secretKey', { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(401).send('Credenciais inválidas.');
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao fazer login.');
    }
});

// Rota para atualizar a vida do herói e do vilão
app.post('/atualizarVida', async (req, res) => {
    const { vidaHeroi, vidaVilao } = req.body;

    try {
        const sql = `
            UPDATE Personagens SET Vida = ? WHERE Nome = 'heroi';
            UPDATE Personagens SET Vida = ? WHERE Nome = 'vilao';
        `;
        connection.query(sql, [vidaHeroi, vidaVilao], (err, result) => {
            if (err) {
                console.error('Erro ao atualizar a vida do herói e do vilão:', err);
                res.status(500).send('Erro ao atualizar a vida do herói e do vilão.');
                return;
            }
            console.log('Vida do herói e do vilão atualizada com sucesso.');
            res.status(200).send('Vida do herói e do vilão atualizada com sucesso.');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao atualizar a vida do herói e do vilão.');
    }
});

// Rota para fornecer os dados do herói e do vilão
app.get('/characters', async (req, res) => {
    try {
        const sql = `SELECT * FROM Personagens WHERE Nome IN ('heroi', 'vilao')`;
        connection.query(sql, (err, result) => {
            if (err) {
                console.error('Erro ao buscar dados do herói e do vilão:', err);
                res.status(500).json({ error: 'Erro ao buscar dados do herói e do vilão.' });
                return;
            }
            const [heroi, vilao] = result;
            res.status(200).json({ heroi, vilao });
        });
    } catch (err) {
        console.error('Erro ao buscar dados do herói e do vilão:', err);
        res.status(500).json({ error: 'Erro ao buscar dados do herói e do vilão.' });
    }
});

// Rota para servir o arquivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/jogo', (req, res) => {
    res.sendFile(path.join(__dirname, 'jogo.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
});
