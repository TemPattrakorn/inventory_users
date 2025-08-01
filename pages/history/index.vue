<template>
  <div style="background-color: #F5F5F5; min-height: 100%">
    <v-container class="mx-auto pa-4">
      <v-card rounded="lg">
        <v-card-title class="text-h5 pa-4"
        >ประวัติการเบิกวัสดุ
        </v-card-title>
        
        <v-data-table
          :headers="headers"
          :items="tableItems"
          :loading="loading"
          item-value="id"
          class="elevation-1"
          :items-per-page="10"
        >
          <template v-slot:item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>
          
          <template v-slot:item.pickupTime="{ item }">
            {{ item.pickupTime ? formatDate(item.pickupTime) : '-' }}
          </template>
          
          <template v-slot:item.reqstatus="{ item }">
            <div class="d-flex justify-center">
              <v-chip
                :color="getStatusColor(item.reqstatus)"
              >
              {{ getStatusText(item.reqstatus) }}
              </v-chip>
            </div>
          </template>
          
          <template v-slot:item.reqDescription="{ item }">
            <div style="max-width: 200px; white-space: normal; word-wrap: break-word;">
              {{ item.reqDescription || '-' }}
            </div>
          </template>
          
                     <template v-slot:item.items="{ item }">
             <div>
               <div v-for="reqItem in item.requisition_items" :key="reqItem.id" class="mb-1">
                 <span v-if="loadingItems">กำลังโหลด...</span>
                 <span v-else>{{ reqItem.itemName || 'ไม่พบชื่อรายการ' }}</span>
               </div>
             </div>
           </template>
          
                     <template v-slot:item.quantities="{ item }">
             <div>
               <div v-for="reqItem in item.requisition_items" :key="reqItem.id" class="mb-1">
                 <span v-if="loadingItems">กำลังโหลด...</span>
                 <span v-else>{{ reqItem.quantity }} {{ reqItem.unit || '' }}</span>
               </div>
             </div>
           </template>
          
          <template v-slot:no-data>
            <div class="text-center pa-4">
              <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-history</v-icon>
              <p class="text-medium-emphasis">ไม่พบประวัติการเบิกวัสดุ</p>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
import { ref, onMounted, computed } from 'vue'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()
const API_BASE_URL = config.public.apiUrl
const API_BEARER_TOKEN = config.public.apiToken

interface InventoryUser {
  id: number
  documentId: string
  username: string
  email: string
  role: string
}

interface RequisitionItem {
  id: number
  documentId: string
  quantity: number
  createdAt: string
  updatedAt: string
  publishedAt: string
  itemName?: string
  unit?: string
}

interface Requisition {
  id: number
  documentId: string
  reqstatus: 'awaitPickup' | 'cancelled' | 'completed'
  createdAt: string
  updatedAt: string
  publishedAt: string
  reqDescription: string
  pickupTime: string | null
  inventory_user: InventoryUser
  requisition_items: RequisitionItem[]
}

const requisitions = ref<Requisition[]>([])
const loading = ref(false)
const userDocumentId = ref('')
const loadingItems = ref(false)

const headers = [
  { title: 'วันที่ขอเบิก', key: 'createdAt', sortable: true, width: '160px' },
  { title: 'วันที่รับ/วันที่ยกเลิก', key: 'pickupTime', sortable: true, width: '160px' },
  { title: 'รายการ', key: 'items', sortable: false },
  { title: 'จำนวน', key: 'quantities', sortable: false },
  { title: 'เหตุผลที่ขอเบิก', key: 'reqDescription', sortable: false },
  { title: 'สถานะการเบิก', key: 'reqstatus', sortable: true, width: '150px' },
]

interface TableItem {
  id: number
  createdAt: string
  reqDescription: string
  reqstatus: 'awaitPickup' | 'cancelled' | 'completed'
  pickupTime: string | null
  requisition_items: RequisitionItem[]
}

// Computed property to prepare data for the table
const tableItems = computed((): TableItem[] => {
  return requisitions.value.map(requisition => ({
    id: requisition.id,
    createdAt: requisition.createdAt,
    reqDescription: requisition.reqDescription,
    reqstatus: requisition.reqstatus,
    pickupTime: requisition.pickupTime,
    requisition_items: requisition.requisition_items
  }))
})

// Function to get user document ID from localStorage
const getUserDocumentId = () => {
  if (process.client) {
    const userProfile = localStorage.getItem('userProfile')
    if (userProfile) {
      const profile = JSON.parse(userProfile)
      return profile.documentId || profile.id?.toString()
    }
  }
  return null
}

// Function to fetch item details by documentId
const fetchItemDetails = async (documentId: string) => {
  try {
    const url = `${API_BASE_URL}/api/requisition-items/${documentId}?populate[item][fields]=name,unit`
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_BEARER_TOKEN}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      return {
        name: data.data?.item?.name || 'ไม่พบชื่อรายการ',
        unit: data.data?.item?.unit || ''
      }
    } else {
      console.error(`Failed to fetch item details for ${documentId}`)
      return { name: 'ไม่พบชื่อรายการ', unit: '' }
    }
  } catch (error) {
    console.error(`Error fetching item details for ${documentId}:`, error)
    return { name: 'ไม่พบชื่อรายการ', unit: '' }
  }
}

// Function to fetch all item names for requisition items
const fetchAllItemNames = async () => {
  loadingItems.value = true
  try {
    const promises: Promise<void>[] = []
    
    requisitions.value.forEach(requisition => {
      requisition.requisition_items.forEach(reqItem => {
        const promise = fetchItemDetails(reqItem.documentId).then(itemDetails => {
          reqItem.itemName = itemDetails.name
          reqItem.unit = itemDetails.unit
        })
        promises.push(promise)
      })
    })
    
    await Promise.all(promises)
  } catch (error) {
    console.error('Error fetching all item names:', error)
  } finally {
    loadingItems.value = false
  }
}

// Function to fetch acquisition history
const fetchAcquisitionHistory = async () => {
  if (!userDocumentId.value) {
    console.error('User document ID not found')
    return
  }
  
  loading.value = true
  try {
    const url = `${API_BASE_URL}/api/requisitions?filters[inventory_user][documentId]=${userDocumentId.value}&populate=*&sort=createdAt:desc`
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_BEARER_TOKEN}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      requisitions.value = data.data
      
      // Fetch item names after getting requisitions
      if (data.data.length > 0) {
        await fetchAllItemNames()
      }
    } else {
      console.error('Failed to fetch acquisition history')
    }
  } catch (error) {
    console.error('Error fetching acquisition history:', error)
  } finally {
    loading.value = false
  }
}

// Function to format date with time
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

// Function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'awaitPickup':
      return 'orange'
    case 'cancelled':
      return 'red'
    case 'completed':
      return 'blue'
    default:
      return 'grey'
  }
}

// Function to get status text
const getStatusText = (status: string) => {
  switch (status) {
    case 'awaitPickup':
      return 'รอรับวัสดุ'
    case 'cancelled':
      return 'ยกเลิกการเบิก'
    case 'completed':
      return 'รับวัสดุแล้ว'
    default:
      return status
  }
}

// Initialize on component mount
onMounted(() => {
  userDocumentId.value = getUserDocumentId()
  if (userDocumentId.value) {
    fetchAcquisitionHistory()
  } else {
    console.error('Unable to get user document ID from localStorage')
  }
})
</script>

<style scoped>
.v-data-table {
  background-color: white;
}

.v-card {
  background-color: white;
}
</style>