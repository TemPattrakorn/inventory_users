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
            <v-col cols="7">
                <v-card-title class="pt-3">{{ProductName}}</v-card-title>
                <v-card-text>{{ProductDescription}}</v-card-text>
            </v-col>
            <v-col cols="4" class="d-flex flex-column justify-center">
                    <div class="d-flex align-center gap-2">
                        <p class="text-caption text-medium-emphasis mx-2">คงเหลือ {{ProductQuantity}}</p>
                            <v-number-input
                                v-model="inputQuantity"
                                control-variant="split"
                                :min="0" 
                                :max="ProductQuantity"
                                class="centered-input ma-2"
                            ></v-number-input>
                        <v-btn rounded="lg" variant="tonal" color="primary" class="ma-2">เพิ่มรายการ</v-btn>
                    </div>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

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

interface Props {
    item: Item;
}

const props = defineProps<Props>();

// Reactive variable for input quantity
const inputQuantity = ref(0);

// Computed properties to map API data to component properties
const ProductName = computed(() => props.item.name);
const ProductQuantity = computed(() => props.item.stockqnt);
const ProductDescription = computed(() => props.item.description);
const ProductImgUrl = computed(() => {
    if (props.item.imgpath && props.item.imgpath.length > 0) {
        const image = props.item.imgpath[0];
        // Use thumbnail if available, otherwise fall back to original URL
        const baseUrl = 'http://localhost:1337';
        if (image.formats?.thumbnail?.url) {
            return baseUrl + image.formats.thumbnail.url;
        } else if (image.url) {
            return baseUrl + image.url;
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