<template>
    <v-card rounded="lg">
        <v-row>
            <v-col cols="1" class="d-flex align-center justify-center">
                <v-img 
                    class="rounded-lg ml-8"
                    cover 
                    height="80px"
                    width="80px"
                    aspect-ratio="1" 
                    :src="ProductImgUrl"
                ></v-img>
            </v-col>
            <v-col cols="6">
                <v-card-title class="pt-3">{{ProductName}}</v-card-title>
                <v-card-text>{{ProductDescription}}</v-card-text>
            </v-col>
            <v-col cols="2" class="d-flex flex-column justify-center">
                <p class="text-caption text-medium-emphasis mx-2 text-right">คงเหลือ {{ProductQuantity}} {{ProductUnit}}</p>
            </v-col>
            <v-col cols="3" class="d-flex flex-column justify-center">
                    <div class="d-flex align-center gap-2">
                        <v-number-input
                            v-model="inputQuantity"
                            control-variant="stacked"
                            :min="0" 
                            :max="ProductQuantity"
                            :disabled="ProductQuantity <= 0"
                            class="centered-input ma-2"
                            inset
                        ></v-number-input>
                        <v-btn 
                          rounded="lg" 
                          variant="tonal" 
                          color="primary" 
                          class="ma-2"
                          @click="addToBasket"
                          :disabled="inputQuantity <= 0"
                        >เพิ่มรายการ</v-btn>
                    </div>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRuntimeConfig } from '#app';

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

interface Props {
    item: Item;
    basketItems?: BasketItem[];
}

const config = useRuntimeConfig();
const API_BASE_URL = config.public.apiUrl;

const props = defineProps<Props>();

// Define emit for adding items to basket
const emit = defineEmits<{
  'add-to-basket': [item: Item, quantity: number]
}>();

// Reactive variable for input quantity
const inputQuantity = ref(0);

// Function to add item to basket
const addToBasket = () => {
  if (inputQuantity.value > 0) {
    emit('add-to-basket', props.item, inputQuantity.value);
    inputQuantity.value = 0; // Reset input after adding
  }
};

// Computed properties to map API data to component properties
const ProductName = computed(() => props.item.name);
const ProductDescription = computed(() => props.item.description);

// Computed property to get available quantity (stock minus what's already in basket)
const availableQuantity = computed(() => {
  if (!props.basketItems) return props.item.stockqnt;
  
  const basketItem = props.basketItems.find(basketItem => basketItem.item.id === props.item.id);
  if (basketItem) {
    return props.item.stockqnt - basketItem.acquisitionQuantity;
  }
  return props.item.stockqnt;
});

const ProductQuantity = computed(() => availableQuantity.value);
const ProductUnit = computed(() => props.item.unit);
const ProductImgUrl = computed(() => {
    if (props.item.imgpath && props.item.imgpath.length > 0) {
        const image = props.item.imgpath[0];
        // Use thumbnail if available, otherwise fall back to original URL
        if (image.formats?.thumbnail?.url) {
            return API_BASE_URL + image.formats.thumbnail.url;
        } else if (image.url) {
            return API_BASE_URL + image.url;
        }
    }
    // Fallback to No_image_available.png if no image is available
    return '/No_image_available.png';
});

</script>

<style scoped>
.centered-input :deep(input) {
  text-align: center;
  width: 60px;
}
</style>