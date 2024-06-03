const heroi = {
    nome: 'Batman',
    vida: 100,
    imagem: './img/batman.png'
};

const vilao = {
    nome: 'Coringa',
    vida: 100,
    imagem: './img/coringaa.png'
};

function atacar(atacante, alvo) {cs
    const dano = Math.floor(Math.random() * 10) + 1; 
    alvo.vida -= dano;
    if (alvo.vida < 0) {
        alvo.vida = 0; 
        console.log(`${alvo.nome} foi derrotado!`);
    }
}

function defender(defensor) {
}

function usarPocao(personagem) {
}

function correr(personagem) {
}

atacar(heroi, vilao);
