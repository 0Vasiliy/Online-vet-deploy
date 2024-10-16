<template>
    <div class="about">
     <div class="about-wrapper">
        <div class="about-block">
            <h1>Ветеринарная клиника "ЛИС"</h1>
            <h2>Запись на приём</h2>
            <img src="../../img/logo.jpg">
            <router-link class="about-link" to="/Login">Вход</router-link>
            <router-link class="about-link" to="/Register">Регистрация</router-link>
        </div>
     </div>
    </div>
</template>
<script>
export default {
    name: 'About'
}
</script>
<style scoped>
    .about{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10%;   
        }
    .about-wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        background: #D3D3D3;
        border-radius: 5px;
        max-width: 500px;
        height: 400px;
        }
    .about-block{
        display: flex;
        align-items: center;
        flex-direction: column;
        border: 5px solid #2F4F4F;
        border-radius: 5px;
        width: 500px;
        height: 400px;
        padding: 20px;
    }
    .about-link{
        margin-top: 20px;
        font-size: 28px;
        text-decoration: none;
        color:  #2F4F4F;
    }
    .about-link:hover{
        color: #006400;
    }
    h1{
        text-align: center;
        margin-top: 20px;
        font-size: 30px;
        color: #2F4F4F;
    }
    h2{
        margin-top: 20px;
        font-size: 24px;
        color: #2F4F4F;
    }
    img{
        margin-top: 20px;
        width: 80px;
        height: 80px;
        border-radius: 50%;
    }
    @media(max-width: 550px){
        .about-wrapper{
            max-width: 300px;
        }
        h1{
            font-size: 24px;
        }
        h2{
            font-size: 20px;
        }
        .about-link{
            font-size: 24px;
        }
    }
    @media(max-width: 350px){
        .about-wrapper{
            max-width: 250px;
        }
        h1{         
            font-size: 20px;
        }
        h2{
            font-size: 16px;
        }
        .about-link{
            font-size: 20px;
        }
    }
</style>