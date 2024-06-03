const ComponenteA = {
  template: `
    <div class="login">
      <h1>Login</h1>
      <input v-model="nome" class="input" type="text" placeholder="Nome">
      <br><br>
      <input v-model="senha" class="input" type="password" placeholder="Senha">
      <br><br>
      <button class="button" @click="entrar">Entrar</button>
      <br><br>
      <p class="perg">Ainda não tem login? <a style="color:blue; cursor: pointer" @click="$emit('alterar')" >Cadastrar-se</a></p>
    </div>
  `,
  data() {
    return {
      nome: '',
      senha: ''
    };
  },
  methods: {
    async entrar() {
      window.alert("Um momento...")
      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nome: this.nome, senha: this.senha })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          window.location.href = 'jogo.html';
        } else {
          alert('Falha ao tentar logar: Nome ou senha incorretos.');
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login.');
      }
    }
  }
};

const ComponenteB = {
  template: `
    <main class="container">
      <h1 class="title">Cadastrar-se</h1>
      <form class="form" @submit.prevent="cadastrar">
        <input v-model="nome" type="text" class="input" placeholder="Nome completo">
        <input v-model="email" type="email" class="input" placeholder="E-mail">
        <input v-model="idade" type="number" class="input" placeholder="Idade">
        <input v-model="senha" type="password" class="input" placeholder="Senha">
        <input v-model="confirmarSenha" type="password" class="input" placeholder="Confirmar senha">
        <button type="submit" class="btn">Cadastrar</button>
      </form>
    </main>
  `,
  data() {
    return {
      nome: '',
      email: '',
      idade: '',
      senha: '',
      confirmarSenha: ''
    };
  },
  methods: {
    async cadastrar() {
      if (this.senha !== this.confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
      }

      try {
        const response = await fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nome: this.nome,
            email: this.email,
            idade: this.idade,
            senha: this.senha
          })
        });

        if (response.ok) {
          alert('Usuário cadastrado com sucesso.');
          this.$emit('alterar');
        } else {
          alert('Erro ao cadastrar usuário.');
        }
      } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro ao cadastrar usuário.');
      }
    }
  }
};

const { createApp } = Vue;

createApp({
  data() {
    return {
      componenteAtual: "ComponenteA"
    };
  },
  methods: {
    alterarComponentes() {
      this.componenteAtual = (this.componenteAtual === "ComponenteA") ? "ComponenteB" : "ComponenteA";
    }
  },
  components: {
    ComponenteA,
    ComponenteB
  }
}).mount("#app");
