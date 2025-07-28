<template>
  <v-card class="mb-2" rounded="lg">
    <v-row align="center">
      <v-col cols="3" class="d-flex justify-center">
        <v-img 
          class="rounded-lg"
          cover 
          height="60px"
          width="60px"
          aspect-ratio="1" 
          :src="ProductImgUrl"
        ></v-img>
      </v-col>
      <v-col cols="6">
        <v-card-title class="text-subtitle-1 pa-0">{{ ProductName }}</v-card-title>
        <v-card-text class="pa-0 text-caption">จำนวน: {{ acquisitionQuantity }}</v-card-text>
      </v-col>
      <v-col cols="3" class="d-flex justify-center">
        <v-btn 
          icon="mdi-delete" 
          variant="text" 
          color="error" 
          size="small"
          @click="$emit('remove-item', basketItem.item.id)"
        ></v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
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
    basketItem: BasketItem;
}

const config = useRuntimeConfig();
const API_BASE_URL = config.public.apiUrl;

const props = defineProps<Props>();

// Define emit for removing items
defineEmits<{
  'remove-item': [itemId: number]
}>();

// Computed properties
const ProductName = computed(() => props.basketItem.item.name);
const acquisitionQuantity = computed(() => props.basketItem.acquisitionQuantity);
const ProductImgUrl = computed(() => {
    if (props.basketItem.item.imgpath && props.basketItem.item.imgpath.length > 0) {
        const image = props.basketItem.item.imgpath[0];
        if (image.formats?.thumbnail?.url) {
            return API_BASE_URL + image.formats.thumbnail.url;
        } else if (image.url) {
            return API_BASE_URL + image.url;
        }
    }
    return '/No_image_available.png';
});
</script>

<style scoped>
.v-card-title {
  line-height: 1.2;
}
</style>