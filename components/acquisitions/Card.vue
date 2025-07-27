<template>
    <v-card rounded="lg">
        <v-row>
            <v-col cols="3">
                <v-img cover height="100%"
                    :src="ProductImgUrl"></v-img>
            </v-col>
            <v-col cols="9" class=" pr-8">
                <v-card-title class="pt-3">{{ProductName}}</v-card-title>
                <v-card-text>{{ProductDescription}}</v-card-text>
                
                <v-card-acions class="pb-4 ga-6 d-flex justify-end align-center">
                    <p class="text-caption text-medium-emphasis">คงเหลือ {{ProductQuantity}}</p>
                    <v-card variant="tonal" color="grey-darken-2">
                        <v-text-field 
                            control-variant="split" 
                            rounded="lg"
                            :min="0" 
                            class="centered-input"
                        ></v-text-field>
                    </v-card>
                    <v-btn  rounded="lg" variant="tonal" color="primary">เพิ่มรายการ</v-btn>
                </v-card-acions>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">

const ProductName = 'test'
const ProductQuantity = 0
const ProductDescription = ''
const ProductImgUrl = 'http://localhost:1337/uploads/large_A3_ream_03_bace8e04e0.jpg'

</script>

<style scoped>
.centered-input :deep(input) {
  text-align: center;
  width: 60px
}



</style>