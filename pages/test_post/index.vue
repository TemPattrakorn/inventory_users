<template>
  <v-container>
    <v-card>
      <v-card-title>Submit Name and Quantity</v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="isFormValid">
          <v-text-field
              v-model="formData.name"
              label="Name"
              placeholder="Enter name"
              required
              :rules="[rules.required]"
          ></v-text-field>

          <v-text-field
              v-model="formData.quantity"
              label="Quantity"
              placeholder="Enter quantity"
              type="number"
              required
              :rules="[rules.required, rules.isNumber]"
          ></v-text-field>
        </v-form>
        <v-alert v-if="message" type="info" class="mt-4">{{ message }}</v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="loading || !isFormValid" color="primary" @click="submitForm">
          <v-progress-circular
              v-if="loading"
              indeterminate
              size="20"
              color="white"
          ></v-progress-circular>
          <span v-else>Submit</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

const formData = ref({
  name: "",
  quantity: 0,
});

const loading = ref(false);
const message = ref("");
const isFormValid = ref(false);
const formRef = ref(null);

const rules = {
  required: (value) => !!value || "This field is required.",
  isNumber: (value) => !isNaN(value) || "Must be a number.",
};

const submitForm = async () => {
  if (formRef.value.validate()) {
    loading.value = true;
    message.value = "";

    try {
      const response = await $fetch("http://localhost:1337/api/items/", {
        method: "POST",
        body: {
          data: {
            Name: formData.value.name,
            Quantity: formData.value.quantity,
          },
        },
      });

      message.value = `Success: ${response.message}`;
      formData.value.name = "";
      formData.value.quantity = 0;
    } catch (error) {
      message.value = `Error: ${error.message}`;
    } finally {
      loading.value = false;
    }
  }
};
</script>

<style scoped>
.v-container {
  display: flex;
  justify-content: center;
}

.v-card-actions {
  justify-content: flex-end;
}
</style>