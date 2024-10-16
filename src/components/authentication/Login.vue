<template>
    <div class=login>
        <form>
            <div class="login-block">
                <h2>Вход в систему</h2>
                <my-input
                v-model="email"
                placeholder="login"
                class="login-input"
                type="text"
                />
                <my-input
                type="password"
                v-model="password"
                placeholder="password"
                class="login-input"             
                />                  
               <div class="login-btns">
                    <my-button class="login-btn" @click.prevent="login($router.replace('/Main'))">Вход</my-button>
                    <my-button class="login-btn" @click.prevent="logout($router.push('/'))">Назад</my-button>
               </div>
            </div>
        </form>
    </div>
</template>

<script>
import MyButton from '../UI/MyButton.vue';
import MyInput from '../UI/MyInput.vue';

import { getAuth,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence, 
    onAuthStateChanged,
    signOut
    } from "firebase/auth";
import app from '../../../firebase'

export default {
 name: 'Login',
 components: {
    MyButton ,
    MyInput,
 },
 data(){
    return{
        user: "",
        email: "",
        password: "",
    }
},
methods:{
    login(){
        const auth = getAuth(app);
        setPersistence(auth, browserLocalPersistence)
        .then(() => {         
            return signInWithEmailAndPassword(auth, this.email, this.password);
        })
        .catch((error) => {
            alert("Не соответствие логина и пароля!")
            console.log(error)
    });
//    this.$router.push("/Main")
    },       
logout(){
    const auth = getAuth(app);
    signOut(auth).then(() => {
    this.user = ''
    }).catch((error) => {
});
},
    },
mounted(){
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user)
        this.user = user.email
        const uid = user.uid;
        
    } else {
        
    }
});
    }
}
</script>

<style scoped>
    .login{
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
    .login-block{
        display: flex;
        flex-direction: column;
        padding: 20px;
    }
    .login-input{
        margin-bottom: 10px;
    }
    .login-btns{
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .login-btn{
        display:flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;    
        width: 200px;
    }
    .login-btn:hover{
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