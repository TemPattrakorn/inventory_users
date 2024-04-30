<template>
  <v-app>
      <v-navigation-drawer
      class="bg-blue-grey-darken-3"
      theme="dark"
      permanent
      >
          <v-list-item
              prepend-avatar="https://cdn.discordapp.com/attachments/436719545647104010/1234881053315960832/AA164681-ADD1-47F2-8937-02AEAAA8D2C2_4_5005_c.jpeg?ex=6632581a&is=6631069a&hm=b9776725c8c04cb6cf53ec6241a4846cc7435d73f004bd8925f55f4a7b2c0234&"
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

