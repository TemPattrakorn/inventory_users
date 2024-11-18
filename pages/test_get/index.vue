<template>
  <div class="flex flex-col gap-2">
    <p class="flex items-center gap-2">
      Result of <code>https://dummyjson.com/products/</code>

      <v-col cols="12" sm="2">
        <h5>Stacked</h5>
        <v-number-input
            v-model="id"
            :min="1"
            control-variant="stacked"
            label="id"
            inset
        ></v-number-input>
      </v-col>

    </p>
    <p class="flex items-center gap-2">

      <v-btn
          :disabled="!canDecrease"
          @click="canDecrease ? id-- : null"
      >
        Previous
      </v-btn>
      -
      <v-btn @click="id++">
        Next
      </v-btn>
    </p>

    <p v-if="pending">
      Fetching...
    </p>
    <pre v-else-if="error">{{ error }}</pre>
    <pre v-else>{{ product }}</pre>

  </div>
</template>

<script setup lang="ts">

const id = ref(1)
const { data: product, pending, error } = await useFetch(() => `https://dummyjson.com/products/${id.value}`)

/* Same as:
const { data: product, pending, error } = await useAsyncData(() => {
  return $fetch(`https://dummyjson.com/products/${id.value}`)
}, {
  watch: [id]
})
*/

const canDecrease = computed(() => id.value > 1)

</script>

<style scoped>
h2 {
  margin-top: 20px;
  margin-left: 20px;
}
</style>