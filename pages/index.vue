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
          <v-card-title class="text-h6 mb-4">รายการเบิกใช้วัสดุ</v-card-title>
          <div v-if="basket.length === 0" class="text-center text-medium-emphasis">
            <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-cart-outline</v-icon>
            <p>ไม่มีข้อมูล</p>
          </div>
          <div v-else>
            <BasketItemCard
              v-for="basketItem in basket"
              :key="basketItem.item.id"
              :basket-item="basketItem"
              @remove-item="removeItemFromBasket"
            />
            <v-divider class="my-4"></v-divider>
            <div>
              <v-textarea
                v-model="reqDescription"
                label="หมายเหตุ/เหตุผลในการเบิก"
                rows="3"
                maxlength="255"
                auto-grow
              ></v-textarea>
            </div>
            <div class="text-center">
              <v-btn 
                color="primary" 
                variant="elevated" 
                block 
                rounded="lg"
                :disabled="basket.length === 0 || isProcessing"
                :loading="isProcessing"
                @click="processAcquisition"
              >
                {{ isProcessing ? 'กำลังประมวลผล...' : `ส่งคำขอเบิก (${basket.length} รายการ)` }}
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
const reqDescription = ref('');
const isProcessing = ref(false);
const userDocumentId = ref('');

// Computed property for filtered items based on search query and category
const filteredItems = computed(() => {
  let filtered = items.value;
  
  // Filter out items with stockqnt = 0
  filtered = filtered.filter(item => item.stockqnt > 0);
  
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

// Function to get user document ID from localStorage
const getUserDocumentId = () => {
  if (process.client) {
    const userProfile = localStorage.getItem('userProfile')
    if (userProfile) {
      const profile = JSON.parse(userProfile)
      return profile.documentId || profile.id?.toString()
    }
  }
  return null
}

// Function to process acquisition
const processAcquisition = async () => {
  if (isProcessing.value) return;
  isProcessing.value = true;

  try {
    const requisitionItemIds: string[] = [];

    // Process each item in the basket
    for (const basketItem of basket.value) {
      const { item, acquisitionQuantity } = basketItem;
      
      // Step 1: Fetch current stockqnt for the item
      const fetchResponse = await fetch(`${API_BASE_URL}/api/items/${item.documentId}?fields=stockqnt`, {
        headers: {
          Authorization: `Bearer ${API_BEARER_TOKEN}`
        }
      });

      if (!fetchResponse.ok) {
        throw new Error(`Failed to fetch current stock for item ${item.name}`);
      }

      const fetchData = await fetchResponse.json();
      const currentStock = fetchData.data.stockqnt;

      // Step 2: Calculate new stock quantity
      const newStockQuantity = currentStock - acquisitionQuantity;

      // Validate that stock won't go below 0
      if (newStockQuantity < 0) {
        throw new Error(`Not enough stock for item ${item.name}. Available: ${currentStock}, Requested: ${acquisitionQuantity}`);
      }

      // Step 3: Update the item's stockqnt
      const updateResponse = await fetch(`${API_BASE_URL}/api/items/${item.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_BEARER_TOKEN}`
        },
        body: JSON.stringify({
          data: {
            stockqnt: newStockQuantity
          }
        })
      });

      if (!updateResponse.ok) {
        throw new Error(`Failed to update stock for item ${item.name}`);
      }

      console.log(`Updated ${item.name}: ${currentStock} -> ${newStockQuantity}`);

      // Step 4: Create requisition-item
      const requisitionItemResponse = await fetch(`${API_BASE_URL}/api/requisition-items/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_BEARER_TOKEN}`
        },
        body: JSON.stringify({
          data: {
            quantity: acquisitionQuantity,
            item: item.documentId
          }
        })
      });

      if (!requisitionItemResponse.ok) {
        throw new Error(`Failed to create requisition-item for ${item.name}`);
      }

      const requisitionItemData = await requisitionItemResponse.json();
      const requisitionItemDocumentId = requisitionItemData.data.documentId;
      requisitionItemIds.push(requisitionItemDocumentId);

      console.log(`Created requisition-item for ${item.name}: ${requisitionItemDocumentId}`);
    }

    // Step 5: Create the final requisition
    if (!userDocumentId.value) {
      throw new Error('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่');
    }
    
    const requisitionResponse = await fetch(`${API_BASE_URL}/api/requisitions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_BEARER_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          reqstatus: 'awaitPickup',
          inventory_user: userDocumentId.value,
          requisition_items: requisitionItemIds,
          reqDescription: reqDescription.value || ''
        }
      })
    });

    if (!requisitionResponse.ok) {
      throw new Error('Failed to create requisition');
    }

    const requisitionData = await requisitionResponse.json();
    console.log('Created requisition:', requisitionData.data.documentId);

    // Success - clear basket and form
    alert('ส่งคำขอเบิกสำเร็จ!');
    basket.value = [];
    reqDescription.value = '';
    
    // Refresh the items list to show updated stock quantities
    await fetchData();

  } catch (error) {
    console.error('Error processing acquisition:', error);
    const errorMessage = error instanceof Error ? error.message : 'ไม่ทราบสาเหตุ';
    alert(`เกิดข้อผิดพลาด: ${errorMessage}`);
  } finally {
    isProcessing.value = false;
  }
};

// Fetch data on component mount
onMounted(() => {
  userDocumentId.value = getUserDocumentId();
  if (!userDocumentId.value) {
    console.error('Unable to get user document ID from localStorage');
  }
  fetchData();
});

</script>