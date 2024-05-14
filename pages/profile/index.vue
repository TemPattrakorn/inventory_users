<template>
  <div>
    <h2>Hello from profile</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab, accusantium adipisci alias aliquid animi consequatur, cupiditate distinctio dolore, ducimus eius et eum ex explicabo fuga in iusto laborum maxime molestias necessitatibus nemo nisi nobis optio porro recusandae sit soluta totam veritatis vero voluptatum. A debitis, delectus dicta doloremque, eveniet excepturi ipsum libero magni mollitia nostrum odio totam velit voluptatem? Cupiditate distinctio, dolor iusto minus nobis placeat porro quam voluptatem. Amet corporis debitis eius exercitationem ipsa maiores necessitatibus porro voluptate! At atque cupiditate expedita explicabo in minus molestiae neque non quasi tempora. Debitis dicta distinctio ducimus nam repellendus sunt unde?</p>
    <p>{{divided}}</p>
  </div>
    <v-col v-for="(item,index) in Array(4)" cols = "12" md = "4">
      <v-card>
        <h3>Test</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi corporis eligendi esse ex itaque quaerat quo quod vel, velit vero.</p>
        <p>{{test}}</p>
      </v-card>
    </v-col>
  </template>

<script setup lang="ts">
  const test = 1;
  const divided = test*2;
</script>

<style scoped>
  h2 {
    margin-left: 20px;
    margin-top: 20px;
    font-size: 36px;
  }
  h3 {
    text-align: left;
    margin-left: 20px;
    margin-top: 20px;
  }
  p {
    margin: 20px;
  }
</style>