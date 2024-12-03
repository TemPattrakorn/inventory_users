<template>
  <div class="flex flex-col gap-2">
    <p class="flex items-center gap-2">
      Result of <code>https://dummyjson.com/products/</code>

      <v-col cols="12" sm="2">
        <h5></h5>

        <v-text-field
            v-model="documentId"
            label="documentId"
        ></v-text-field>

      </v-col>

    </p>

    <p v-if="pending">
      Fetching...
    </p>
    <pre v-else-if="error">{{ error }}</pre>
    <pre v-else>{{ product }}</pre>

  </div>
</template>

<script setup lang="ts">

const documentId = ref(0)
const id = ref(1)
const { data: product, pending, error } = await useFetch(() => `http://localhost:1337/api/items/${documentId.value}`)


</script>

<style scoped>
h2 {
  margin-top: 20px;
  margin-left: 20px;
}
</style>