<template>
  <div class="flex flex-col gap-2">
    <p class="flex items-center gap-2">
      <span>Search items by <b>id</b>, <b>documentId</b>, <b>name</b>, <b>unit</b>, or <b>category</b>:</span>
      <v-col cols="12" sm="4">
        <v-text-field
          v-model="searchTerm"
          label="Search"
          clearable
        ></v-text-field>
      </v-col>
    </p>

    <p v-if="pending">
      Fetching...
    </p>
    <pre v-else-if="error">{{ error }}</pre>
    <pre v-else>{{ filteredResults }}</pre>

    <div class="flex gap-4 mt-2">
      <v-btn :color="showDepleted ? 'grey' : 'red'" @click="toggleDepleted">Depleted</v-btn>
      <v-btn :color="showNearlyDepleted ? 'grey' : 'orange'" @click="toggleNearlyDepleted">Nearly Depleted</v-btn>
    </div>

    <div v-if="showDepleted" class="mt-2">
      <h4>Depleted Items (stockqnt = 0):</h4>
      <ul>
        <li v-for="item in depletedItems" :key="item.documentId">
          <pre>{{ item }}</pre>
        </li>
      </ul>
    </div>
    <div v-if="showNearlyDepleted" class="mt-2">
      <h4>Nearly Depleted Items (stockqnt ≤ minqnt):</h4>
      <ul>
        <li v-for="item in nearlyDepletedItems" :key="item.documentId">
          <pre>{{ item }}</pre>
        </li>
      </ul>
    </div>

    <!-- Display unique categories at the bottom -->
    <div v-if="categories.length" class="mt-4">
      <h3>Categories:</h3>
      <div class="flex flex-wrap gap-2">
        <v-btn
          v-for="cat in categories"
          :key="String(cat)"
          :color="selectedCategory === String(cat) && showCategory ? 'grey' : 'primary'"
          @click="toggleCategory(cat)"
        >
          {{ cat }}
        </v-btn>
      </div>
    </div>
    <div v-if="showCategory" class="mt-2">
      <h4>Items in category: {{ selectedCategory }}</h4>
      <ul>
        <li v-for="item in categoryItems" :key="String(item.documentId)">
          <pre>{{ item }}</pre>
        </li>
      </ul>
    </div>

    <!-- Display images at the bottom of the page -->
    <div v-if="filteredResults.length" class="mt-8">
      <h3>Images from Database:</h3>
      <div v-for="item in filteredResults" :key="item.documentId" class="mb-4">
        <div v-if="item.imgpath && Array.isArray(item.imgpath) && item.imgpath.length">
          <h4>{{ item.name }} ({{ item.documentId }})</h4>
          <div class="flex flex-wrap gap-2">
            <div v-for="img in item.imgpath" :key="img.id">
              <img
                :src="img.formats && img.formats.thumbnail ? 'http://localhost:1337' + img.formats.thumbnail.url : 'http://localhost:1337' + img.url"
                :alt="img.name"
                style="max-width: 200px; max-height: 200px;"
              />
              <div>{{ img.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
/*
const query = qs.stringify(
    {
      fields: ['name', 'description'],
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
);

const testqs = $fetch(`/api/users?${query}`);

 */

const searchTerm = ref("");

// Fetch all items once
const { data: product, pending, error } = await useFetch(() => `http://localhost:1337/api/items?populate=*`, {
  headers: {
    //Authorization: '47e548113e5c35750c07c03b94b65e5064bd766eb8d81fec7aa84398b469b6ed4d922c112ad5986420c6730cf0468facf4c07c520327982aa07524b80e88bd85b04bfdbc8d98f34086a31d0f4b8aae00b494c0f2d07017193bb2c6824a4cdda2f5c03bbb7da4bd0017778154f68fc526e483adab7da7c0e25e9553773a540e46',
  }
}) as { data: any, pending: any, error: any }

// Computed filtered results
const filteredResults = computed(() => {
  const value = (product as any).value;
  if (!value || !value.data) return [];
  if (!searchTerm.value) return value.data;
  const term = searchTerm.value.toLowerCase();
  return value.data.filter((item: any) => {
    return (
      String(item.id).includes(term) ||
      (item.documentId && item.documentId.toLowerCase().includes(term)) ||
      (item.name && item.name.toLowerCase().includes(term)) ||
      (item.unit && item.unit.toLowerCase().includes(term)) ||
      (item.category && item.category.toLowerCase().includes(term))
    );
  });
});

// Extract unique categories from the filtered results
const categories = computed(() => {
  if (!filteredResults.value.length) return [];
  const allCategories = filteredResults.value.map((item: any) => item.category);
  return Array.from(new Set(allCategories));
});

// Arrays to store full item objects for depleted and nearly depleted items
const depletedItems = computed(() => {
  if (!filteredResults.value.length) return [];
  return filteredResults.value
    .filter((item: any) => item.stockqnt === 0);
});

const nearlyDepletedItems = computed(() => {
  if (!filteredResults.value.length) return [];
  return filteredResults.value
    .filter((item: any) => item.stockqnt > 0 && item.stockqnt <= item.minqnt);
});

const showDepleted = ref(false);
const showNearlyDepleted = ref(false);

function toggleDepleted() {
  if (showDepleted.value) {
    showDepleted.value = false;
  } else {
    showDepleted.value = true;
    showNearlyDepleted.value = false;
    showCategory.value = false;
    selectedCategory.value = "";
  }
}

function toggleNearlyDepleted() {
  if (showNearlyDepleted.value) {
    showNearlyDepleted.value = false;
  } else {
    showNearlyDepleted.value = true;
    showDepleted.value = false;
    showCategory.value = false;
    selectedCategory.value = "";
  }
}

const showCategory = ref(false);
const selectedCategory = ref("");
const categoryItems = ref<any[]>([]);

function toggleCategory(cat: unknown) {
  const catStr = String(cat);
  if (showCategory.value && selectedCategory.value === catStr) {
    showCategory.value = false;
    selectedCategory.value = "";
    categoryItems.value = [];
  } else {
    selectedCategory.value = catStr;
    showCategory.value = true;
    showDepleted.value = false;
    showNearlyDepleted.value = false;
    // Filter items by selected category
    if (!filteredResults.value.length) {
      categoryItems.value = [];
      return;
    }
    categoryItems.value = filteredResults.value.filter((item: any) => item.category === catStr);
  }
}

</script>

<style scoped>
h2 {
  margin-top: 20px;
  margin-left: 20px;
}
</style>