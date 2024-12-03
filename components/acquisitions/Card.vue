<template>
    <v-card rounded="lg">
        <v-row>
            <v-col cols="3">
                <v-img cover height="100%"
                    :src="mockProductImgUrl"></v-img>
            </v-col>
            <v-col cols="9" class=" pr-8">
                <v-card-title class="pt-3">{{mockProductName}}</v-card-title>
                <v-card-text>{{mockProductDescription}}</v-card-text>
                <v-card-acions class="pb-4 ga-6 d-flex justify-end align-center">
                    <p class="text-caption text-medium-emphasis">คงเหลือ 5 กล่อง</p>
                    <v-card class="d-flex rounded-pill" variant="tonal" color="grey-darken-2">
                        <v-btn variant="text" class="rounded-0" style="height: auto;"><v-icon>mdi-minus</v-icon></v-btn>
                        <v-text-field
                            variant="solo"
                            density="compact"
                            rounded="0"
                            single-line class="centered-input"
                            hide-details
                        ></v-text-field>
                        <v-btn variant="text" class="rounded-0" style="height: auto;"><v-icon>mdi-plus</v-icon></v-btn>
                    </v-card>
                    <v-btn  rounded="lg" variant="tonal" color="primary">เพิ่มรายการ</v-btn>
                </v-card-acions>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>

const mockProductName =  `DOUBLE A Copier Paper A3 80 gsm. (500 Sheets)`
const mockProductDescription = `Moderately bright white copier paper from farm dike Thick papers allow for double-sided printing for added cost effectiveness. Bright white color of paper for outstanding print quality Extend lifetime of photocopier and provide longer time of storage`
const mockProductImgUrl = "https://cdn.discordapp.com/attachments/905760572296019988/1310484362105585694/A3_ream_03.jpg?ex=6745632b&is=674411ab&hm=670db5c385de5bd7aa08b0efaa88bed24e5a4cca38f78370d9609aeb936eb6b0&"
//const mockProductImgUrl = ``

export default {
    data() {
        return {
            mockProductName,
            mockProductDescription,
            mockProductImgUrl
        }
    }
}

</script>

<style scoped>
.centered-input :deep(input) {
  text-align: center;
  width: 60px
}



</style>