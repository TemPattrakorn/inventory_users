<template>
  <div style="background-color: #F5F5F5; min-height: 100%">
    <v-row class="pa-4">
      <v-col cols="9">
        <v-row>
          <v-col cols="9">
            <v-text-field 
              v-model="searchQuery"
              rounded="pill" 
              density="compact" 
              variant="solo" 
              label="ค้นหาวัสดุ"
              single-line hide-details prepend-inner-icon="mdi-magnify" 
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select 
              label="หมวดหมู่"
              v-model="selectedCategory"
              :items="categories"
              rounded="pill"
              density="compact"
              variant="solo-filled"
              single-line hide-details
              clearable
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="item in filteredItems" :key="item.id" cols="12">
            <AcquisitionsCard :item="item" />
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
definePageMeta({ middleware: 'auth' })
import { ref, onMounted, computed } from 'vue';
import AcquisitionsCard from '~/components/acquisitions/ItemCard.vue';

interface ItemImage {
    id: number;
    url: string;
    formats?: {
        thumbnail?: { url: string };
        small?: { url: string };
        medium?: { url: string };
        large?: { url: string };
    };
}

interface Item {
    id: number;
    documentId: string;
    name: string;
    description: string;
    stockqnt: number;
    minqnt: number;
    category: string;
    unit: string;
    imgpath: ItemImage[] | null;
}

const items = ref<Item[]>([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const categories = ref<string[]>([]);

// Computed property for filtered items based on search query and category
const filteredItems = computed(() => {
  let filtered = items.value;
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(query)
    );
  }
  
  // Filter by selected category
  if (selectedCategory.value) {
    filtered = filtered.filter(item => 
      item.category === selectedCategory.value
    );
  }
  
  return filtered;
});

// Function to fetch data using GET method
const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:1337/api/items?populate=*'); // Updated API endpoint with populate=*
    if (response.ok) {
      const data = await response.json();
      items.value = data.data; // Accessing the items from the 'data' field in the API response
      const uniqueCategories = [...new Set(data.data.map((item: Item) => item.category))];
      categories.value = uniqueCategories.filter((category) => typeof category === 'string' && category.trim() !== '') as string[];
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

</script>