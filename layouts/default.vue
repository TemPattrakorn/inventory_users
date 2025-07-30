<template>
    <v-app>
        <v-navigation-drawer
        class="bg-blue-grey"
        >
            <v-list-item class = "my-2"
              :prepend-avatar="userProfile?.photoURL || userProfile?.profilePicture || ''"
              :title="userProfile?.username || 'Guest'"
              :subtitle="userProfile?.email || ''"
            ></v-list-item>

            <v-divider></v-divider>

            <v-list nav>
              <v-list-item
                prepend-icon="mdi-pencil"
                link to = "/"
                title = "เบิกใช้วัสดุ"
              ></v-list-item>
              <v-list-item
                prepend-icon="mdi-history"
                link to="/history"
                title="ประวัติการเบิกใช้"
              ></v-list-item>
            </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn block color="blue-grey-lighten-5" @click="logout">
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

<script setup lang="ts" middleware="auth">
import { useRouter, useRoute } from 'vue-router'
import { useNuxtApp } from '#app'
import { onMounted, ref } from 'vue'
import { signOut, type Auth } from 'firebase/auth'

interface UserProfile {
  id: number
  email: string
  username: string
  role: string
  photoURL?: string
  profilePicture?: string
  // ...other fields from Strapi if needed
}

const router = useRouter()
const nuxtApp = useNuxtApp()
const auth = nuxtApp.$firebaseAuth as Auth
const userProfile = ref<UserProfile | null>(null)

onMounted(() => {
  if (process.client) {
    const profile = localStorage.getItem('userProfile')
    userProfile.value = profile ? JSON.parse(profile) as UserProfile : null
  }
})

const logout = async () => {
  if (process.client) {
    localStorage.removeItem('userProfile')
    try {
      await signOut(auth)
    } catch (e) {}
    router.push('/login')
  }
}
</script>