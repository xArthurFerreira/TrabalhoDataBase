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

function atacar(atacante, alvo) {
    const dano = Math.floor(Math.random() * 10) + 1; 
    alvo.vida -= dano;
    if (alvo.vida <= 0) {
        alvo.vida = 0; 
        console.log(`${alvo.nome} foi derrotado!`);
        gameOver(alvo);
    }
}

function gameOver(personagem) {
    console.log(`${personagem.nome} está fora do jogo!`);
    // Aqui você pode adicionar qualquer lógica adicional relacionada ao fim do jogo,
    // como exibir uma mensagem de game over, reiniciar o jogo, etc.
}

function iniciarJogo() {
    console.log('O jogo começou!');
    console.log('Herói:', heroi);
    console.log('Vilão:', vilao);
}

// Função para inicializar o jogo quando a página é carregada
window.onload = function() {
    iniciarJogo();
    atacar(heroi, vilao); // Exemplo de ataque inicial
};
