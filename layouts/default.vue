<template>
  <v-app>
      <v-navigation-drawer
      class="bg-blue-grey-darken-3"
      theme="dark"
      permanent
      >
          <v-list-item title="My Application" subtitle="Vuetify"></v-list-item>
          <v-divider></v-divider>
          <v-list-item prepend-icon="mdi-pen" link to="/" title="เบิกใช้วัสดุ"></v-list-item>
          <v-list-item prepend-icon="mdi-file-chart" link to="/history" title="ประวัติการเบิกใช้"></v-list-item>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block>
            Logout
          </v-btn>
        </div>
      </template>
      </v-navigation-drawer>
      <v-main >
          <slot />
      </v-main>
  </v-app>
</template>

