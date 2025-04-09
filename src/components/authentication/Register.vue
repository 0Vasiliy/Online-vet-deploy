<template>
    <div class="register">
        <form>
            <div class="register-block">
                <h2>Регистрация</h2>
                <my-input
                v-model="email"
                placeholder="email"
                class="register-input"
                type="email"
                />
                <my-input
                v-model="password"
                placeholder="password"
                class="register-input"
                type="password"
                />
                <my-input
                v-model="password2"
                placeholder="password"
                class="register-input"
                type="password"
                />
               <div class="register-btns">
                    <my-button class="register-btn" @click.prevent="register">Регистрация</my-button>
                    <my-button class="register-btn" @click="$router.push('/')">Назад</my-button>
               </div>
            </div>
        </form>   
    </div>
</template>

<script>
import MyButton from '../UI/MyButton.vue';
import MyInput from '../UI/MyInput.vue';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from '../../firebase/config'

export default {
 name: 'Register',
 components: {
    MyButton ,
    MyInput
 },
 data(){
    return{
        user: "",
        email: "",
        password: "",
        password2: "",
    }
 },
 methods:{
     register() {
        this.error="";
        if(this.password != this.password2){
           alert(this.error = "Пароли должны совпадать");
            return;
        }
        const auth = getAuth(app);
        createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        alert('Вы зарегистрировались в системе');
        this.$router.push('/Main');
    })
        .catch((error) => {
        this.error = error;
        alert('Не верный формат регистрации'); 
    });
    }
 },
}
</script>
<style scoped>
    .register{
    margin-top: 10%;
    display:flex;
    justify-content: center;
    align-items: center;
    }
    form{
    display:flex;
    justify-content: center;
    align-items: center;
    width: 350px;
    height: 350px;
    border: 2px solid teal;
    border-radius: 5px;
    }
    .register-block{
        display: flex;
        flex-direction: column;
        padding: 20px;
    }
    .register-input{
        margin-bottom: 10px;
    }
    .register-btns{
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .register-btn{
        display:flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;    
        width: 200px;
    }
    .register-btn:hover{
        background: darkcyan;
        color: black;
    }
    h2{
        display:flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        font-size: 28px;
        color: #2F4F4F;
    }
</style>