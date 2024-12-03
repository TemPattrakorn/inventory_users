<template>
  <div class="flex flex-col gap-2">
    <p class="flex items-center gap-2">
      POST

      <v-col cols="12" sm="2">
        <h5></h5>
        <v-text-field
            v-model="Name"
            label="Name"
        ></v-text-field>

        <h5></h5>
        <v-text-field
            label="quantity"
        ></v-text-field>

      </v-col>

    </p>
    <p class="flex items-center gap-2">

      <v-btn
          @click="submitForm"
      >
        Submit
      </v-btn>
    </p>

    <h2></h2>
    <p v-if="pending">
      Fetching...
    </p>
    <pre v-else-if="error">{{ error }}</pre>
    <pre v-else>{{ product }}</pre>

    </div>
    <h2></h2>
    <div>
      <h1>Strapi API Test</h1>
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">Error: {{ error }}</div>
      <pre v-else>{{ data }}</pre>
    </div>

</template>

<script setup lang="ts">
const { $strapi } = useNuxtApp()
const data = ref(null)
const error = ref<string | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await $strapi.get('/api/items')
    data.value = response.data
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'An unknown error occurred'
    }
  } finally {
    loading.value = false
  }
})
</script>


<style scoped>
h2 {
  margin-top: 20px;
  margin-left: 20px;
}
</style>