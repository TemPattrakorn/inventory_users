<template>
  <div>
    <h2>Hello from user history</h2>
    <p></p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>

<style scoped>
h2 {
  margin-top: 20px;
  margin-left: 20px;
}
</style>