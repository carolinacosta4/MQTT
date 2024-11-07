<template>
    <div id="wrapper">
        <img src="../assets/logo.png" alt="">
        <h2>Bem-vindo ao NextIn</h2>
        <div>
            <div class="single-route">
                <router-link :to="{ name: 'cliente' }" class="link">
                    Cliente
                </router-link>
            </div>
            <div class="single-route">
                <router-link :to="{ name: 'atendente' }" class="link">
                    Atendente
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>

</script>

<style scoped>
@font-face {
    font-family: "Karla";
    src: url(https://fonts.gstatic.com/s/karla/v31/qkB9XvYC6trAT55ZBi1ueQVIjQTD-JrIH2G7nytkHRyQ8p4wUjm6bnEr.woff2) format('woff2');
}

* {
    font-family: "Karla", sans-serif;
}

p {
    font-size: 18px;
}

img {
    width: 10em;
}

#wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
}

h2 {
    color: #307e69;
}

.single-route {
    width: 18rem;
    height: 2rem;
    padding: 1rem;
    margin: 1rem;
    background-color: #307E69;
    border: 0;
    border-radius: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.link {
    color: #E7E8E3;
    font-weight: bold;
    text-decoration: none;
    width: 20rem;
    margin: 1rem;
    background-color: #307E69;
    font-size: 18px;
    text-align: center;
}

#wrapper div {
    display: flex;
    flex-direction: row;
}
</style>