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
            <AcquisitionsCard 
              :item="item" 
              :basket-items="basket"
              @add-to-basket="addItemToBasket"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
        <v-card class="pa-4" rounded="lg">
          <v-card-title class="text-h6 mb-4">ตะกร้าสินค้า</v-card-title>
          <div v-if="basket.length === 0" class="text-center text-medium-emphasis">
            <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-cart-outline</v-icon>
            <p>ไม่มีสินค้าในตะกร้า</p>
          </div>
          <div v-else>
            <BasketItemCard
              v-for="basketItem in basket"
              :key="basketItem.item.id"
              :basket-item="basketItem"
              @remove-item="removeItemFromBasket"
            />
            <v-divider class="my-4"></v-divider>
            <div class="text-center">
              <v-btn 
                color="primary" 
                variant="elevated" 
                block 
                rounded="lg"
                :disabled="basket.length === 0"
              >
                ส่งคำขอเบิก ({{ basket.length }} รายการ)
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>


<script setup lang = "ts">
definePageMeta({ middleware: 'auth' })
import { ref, onMounted, computed } from 'vue';
import { useRuntimeConfig } from '#app';
import AcquisitionsCard from '~/components/acquisitions/ItemCard.vue';
import BasketItemCard from '~/components/acquisitions/BasketItemCard.vue';

const config = useRuntimeConfig();
const API_BASE_URL = config.public.apiUrl;
const API_BEARER_TOKEN = config.public.apiToken;

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

interface BasketItem {
    item: Item;
    acquisitionQuantity: number;
}

const items = ref<Item[]>([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const categories = ref<string[]>([]);
const basket = ref<BasketItem[]>([]);

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
  
  // Sort items: available items first, then items with 0 stock at the bottom
  filtered.sort((a, b) => {
    // Calculate available quantity for each item
    const aBasketItem = basket.value.find(basketItem => basketItem.item.id === a.id);
    const bBasketItem = basket.value.find(basketItem => basketItem.item.id === b.id);
    
    const aAvailable = a.stockqnt - (aBasketItem ? aBasketItem.acquisitionQuantity : 0);
    const bAvailable = b.stockqnt - (bBasketItem ? bBasketItem.acquisitionQuantity : 0);
    
    // If both have same availability, maintain original order
    if (aAvailable === bAvailable) return 0;
    
    // Sort by availability (higher availability first)
    return bAvailable - aAvailable;
  });
  
  return filtered;
});

// Function to add item to basket
const addItemToBasket = (item: Item, acquisitionQuantity: number) => {
  // Check if item already exists in basket
  const existingItemIndex = basket.value.findIndex(basketItem => basketItem.item.id === item.id);
  
  // Calculate current quantity in basket
  const currentBasketQuantity = existingItemIndex !== -1 ? basket.value[existingItemIndex].acquisitionQuantity : 0;
  
  // Check if adding this quantity would exceed available stock
  if (currentBasketQuantity + acquisitionQuantity > item.stockqnt) {
    // Don't add if it would exceed stock
    return;
  }
  
  if (existingItemIndex !== -1) {
    // If item exists, update quantity
    basket.value[existingItemIndex].acquisitionQuantity += acquisitionQuantity;
  } else {
    // If item doesn't exist, add new item
    basket.value.push({ item, acquisitionQuantity });
  }
};

// Function to remove item from basket
const removeItemFromBasket = (itemId: number) => {
  const index = basket.value.findIndex(basketItem => basketItem.item.id === itemId);
  if (index !== -1) {
    basket.value.splice(index, 1);
  }
};

// Function to fetch data using GET method with authentication
const fetchData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/items?populate=*`, {
      headers: {
        Authorization: `Bearer ${API_BEARER_TOKEN}`
      }
    });
    if (response.ok) {
      // Accessing the items from the 'data' field in the API response
      const data = await response.json();
      items.value = data.data;
       // Filter out any non-string values and ensure all categories are strings
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