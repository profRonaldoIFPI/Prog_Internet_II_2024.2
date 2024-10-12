<script>
  import UserList from './components/ListaUsuarios.vue'
  export default {
    name: 'App',
    components: {
      UserList,
    },
  };
</script>

<template>
  <div id="app">
    <h2>Cadastro de Usuários</h2>
    <UserList />
  </div>
</template>