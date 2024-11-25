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
            <v-select :items="mockCatagory"
                      rounded="pill"
                      density="compact"
                      variant="solo-filled"
                      label="Category"
                      single-line hide-details
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="(item, index) in Array(4)" :key="index" cols="12">
            <AcquisitionsCard />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
        <v-card class="pa-4" style="position: sticky;top: 10%">
          Selected Side Bar
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>


<script>

export default {
  data: () => ({
    mockCatagory: ['Foo', 'Bar', 'Fizz', 'Buzz', 'Erh'],
  }),
}

</script>