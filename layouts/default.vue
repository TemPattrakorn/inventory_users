<template>
  <v-app>
      <v-navigation-drawer
      class="bg-blue-grey-darken-3"
      theme="dark"
      permanent
      >
          <v-list-item
              prepend-avatar="~/public/Mailbox 6649.jpg"
              title="Tem Pattrakorn"
              subtitle="6334453323"
          ></v-list-item>

          <v-divider></v-divider>

          <v-list-item
              prepend-icon="mdi-pen"
              link to="/"
              title="เบิกใช้วัสดุ"
              value = "acquisition"
          ></v-list-item>
          <v-list-item
              prepend-icon="mdi-file-chart"
              link to="/history"
              title="ประวัติการเบิกใช้"
              value = "history"
          ></v-list-item>
          <v-list-item
              prepend-icon="mdi-test-tube"
              link to="/test_get"
              title = "test_get"
              value = "test_get"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-test-tube-empty"
            link to="/test_post"
            title = "test_post"
            value = "test_post"
          ></v-list-item>
        <v-list-item
            prepend-icon="mdi-test-tube-empty"
            link to="/test_update"
            title = "test_update"
            value = "test_update"
        ></v-list-item>
        <v-list-item
            prepend-icon="mdi-test-tube-empty"
            link to="/test_delete"
            title = "test_delete"
            value = "test_delete"
        ></v-list-item>

          <template v-slot:append>
            <div class="pa-2">
              <v-btn
                  block
                  color="red"
                  variant="text"
                  link to="/profile"
              >
                Profile
              </v-btn>
            </div>
            <div class="pa-2">
              <v-btn block>
                Logout
              </v-btn>
            </div>
          </template>

      </v-navigation-drawer>

      <v-main style="height: 5000px"
      >
        <slot />
      </v-main>
  </v-app>
</template>

<script setup lang="ts">
</script>