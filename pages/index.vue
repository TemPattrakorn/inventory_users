<template>
  <div style="background-color: #F5F5F5; min-height: 100%">
    <v-row class="pa-4">
      <v-col cols="9">
        <v-row>
          <v-col cols="9">
            <v-text-field rounded="pill" density="compact" variant="solo" label="ค้นหาวัสดุ"
                          single-line hide-details prepend-inner-icon="mdi-magnify" />
          </v-col>
          <v-col cols="3">
            <v-select :items="mockCategory"
                      rounded="pill"
                      density="compact"
                      variant="solo-filled"
                      label="Category"
                      single-line hide-details
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="item in items" :key="item.id" cols="12">
            <AcquisitionsCard />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
        <v-card>
          Selected Side Bar
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>


<script setup lang = "ts">
import { ref, onMounted } from 'vue';

const items = ref<any[]>([]);

// Function to fetch data using GET method
const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:1337/api/items/'); // Replace with your API endpoint
    if (response.ok) {
      const data = await response.json();
      items.value = data.data; // Accessing the items from the 'data' field in the API response
    } else {
      console.error('Failed to fetch data');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Fetch data on component mount
onMounted(() => {
  fetchData();
});

const mockCategory: string[] = ['Foo', 'Bar'];

</script>