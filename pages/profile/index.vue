<template>
  <div>
    <h2>Hello from user profile</h2>
    <p>test fetch</p>
    <div v-for="i in inventory">
      <NuxtLink :to="`/product/${i.id}`">{{i.title}}</NuxtLink>
    </div>
  </div>
</template>

<script setup>
  //fetch inventory
  const { data: inventory } = await useFetch('https://fakestoreapi.com/products')
</script>

<style scoped>
h2 {
  margin-top: 20px;
  margin-left: 20px;
}
</style>