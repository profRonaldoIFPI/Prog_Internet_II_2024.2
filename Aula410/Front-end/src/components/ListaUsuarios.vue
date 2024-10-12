<template>
        <div>
            <div class="listUser">
            <h3>Lista de Usuários</h3>
            <button @click="showCreateForm = true">Criar Novo Usuário</button>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.name }}</td>
                        <td>
                            <button @click="editUser(user)">Editar</button>
                            <button @click="deleteUser(user.id)">Deletar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="showCreateForm" class="newUser">
            <h3>Criar Usuário</h3>
            <input v-model="newUser.name" placeholder="Nome do usuário" />
            <button @click="createUser">Salvar</button>
            <button @click="showCreateForm = false">Cancelar</button>
        </div>
        <div v-if="showEditForm" class="editUser">
            <h3>Editar Usuário</h3>
            <input v-model="editUserForm.name" placeholder="Nome do usuário" />
            <button @click="updateUser">Atualizar</button>
            <button @click="showEditForm = false">Cancelar</button>
        </div>
    </div>
</template>
<script>
    import api from '../services/api';
    
    export default {
        // variáveis que serão usadas no script
        data() {
            return {
                users: [],
                showCreateForm: false,
                showEditForm: false,
                newUser: {
                    id: '',
                    name: '',
                },
                editUserForm: {
                    id: '',
                    name: '',
                },
            };
        },
        //funções que serão chamadas a página
        methods: {
            async fetchUsers() { //busca usuários
                try {
                    const response = await api.get('/usuario');
                    this.users = response.data;
                } catch (error) {
                    console.error('Erro ao buscar usuários:', error);
                }
            },
            async createUser() {
                try {
                    await api.post('/usuario', this.newUser);
                    this.newUser = { id: '', name: '' };
                    this.showCreateForm = false;
                    this.fetchUsers();
                } catch (error) {
                    console.error('Erro ao criar usuário:', error);
                }
            },
            editUser(user) {
                this.editUserForm = { ...user };
                this.showEditForm = true;
            },
            async updateUser() {
                try {
                    await api.put(`/usuario/${this.editUserForm.id}`, this.editUserForm);
                    this.editUserForm = { id: '', name: '' };
                    this.showEditForm = false;
                    this.fetchUsers();
                } catch (error) {
                    console.error('Erro ao atualizar usuário:', error);
                }
            },
            async deleteUser(id) {
                try {
                    await api.delete(`/usuario/${id}`);
                    this.fetchUsers();
                } catch (error) {
                    console.error('Erro ao deletar usuário:', error);
                }
            },
        },
        created() {
            this.fetchUsers();
        },
    };
</script>
<style scoped>
    table{
        text-align: left;
    }
    /* .listUser{

    } */
    .newUser {
        background-color: cornsilk;
    }

    .editUser {
        background-color: gainsboro;
    }
</style>