// Importa a função createApp da biblioteca Vue, que é usada para criar uma instância do aplicativo.
import { createApp } from 'vue'

// Importa o arquivo de estilos CSS global, que será aplicado ao aplicativo.
import './style.css'

// Importa o componente principal do aplicativo, geralmente chamado de App.vue, que contém a estrutura principal do Vue.
import App from './App.vue'

// Cria uma instância do aplicativo Vue usando o componente App como o ponto inicial e monta essa instância no elemento com o id 'app' no HTML.
createApp(App).mount('#app')