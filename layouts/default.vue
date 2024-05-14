<template>
  <v-app>
      <v-navigation-drawer
      class="bg-blue-grey-darken-3"
      theme="dark"
      permanent
      >
          <v-list-item
              prepend-avatar="https://cdn.discordapp.com/attachments/443780456479981569/1161213148477538314/1696925163631.jpg?ex=66446d04&is=66431b84&hm=2411f2cca08bf883bc0196f451052c0df1266ba9155cbfb0a931e489db208e53&"
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