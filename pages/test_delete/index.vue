<template>
  <v-container>
    <v-card>
      <v-card-title>Delete Document</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="isValid" lazy-validation>
          <!-- Document ID Field -->
          <v-text-field
              label="Document ID"
              v-model="documentId"
              :rules="[rules.required]"
              outlined
              required
          />
          <!-- Submit Button -->
          <v-btn
              :disabled="!isValid"
              color="error"
              class="mt-4"
              @click="deleteDocument"
          >
            Delete
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const documentId = ref('')
const isValid = ref(false)

const rules = {
  required: value => !!value || 'This field is required.',
}

const deleteDocument = async () => {
  if (!documentId.value) return
  try {
    const response = await fetch(`http://localhost:1337/api/items/${documentId.value}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete document')
    alert('Document deleted successfully!')
    documentId.value = '' // Reset the form
  } catch (error) {
    console.error(error)
    alert('Error deleting document')
  }
}
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