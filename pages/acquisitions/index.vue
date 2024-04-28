<template>
   <v-row class="pa-4">
        <v-col cols="9">
            <v-row>
                <v-col v-for="(item,index) in Array(12)" :key="index" cols="12">
                    <AcquisitionsCard />
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="3">
            <v-card>
                Seleceted Side Bar
            </v-card>
        </v-col>
   </v-row>
</template>


<script>
</script>