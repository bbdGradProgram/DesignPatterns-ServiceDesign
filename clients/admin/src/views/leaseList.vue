<template>
  <div>
    <header>
      <navBar />
    </header>
    <main class="leases-container">
      <h2>Leases</h2>
      <button @click="toggleAddLeaseForm" class="add-lease-btn">Add Lease</button>

      <div v-if="showAddLeaseForm" class="overlay">
        <form @submit.prevent="addLease" class="add-lease-form">
          <h3>Add New Lease</h3>

          <label for="propertyId">Vacant Property:</label>
          <select v-model="newLease.rentalId" id="propertyId" required>
            <option v-for="property in vacantProperties" :key="property.id" :value="property.id">
              {{ property.propertyId }}
            </option>
          </select>

          <label for="tenantId">Tenant person:</label>
          <input type="text" id="tenantId" v-model="newLease.tenantId" required>

          <label for="startDate">Start Date:</label>
          <input type="date" id="startDate" v-model="newLease.startDate" required @change="updateEndDate">

          <label for="endDate">End Date:</label>
          <input type="date" id="endDate" v-model="newLease.endDate" required readonly>

          <label for="cost">Cost:</label>
          <input type="number" :value="selectedCost" id="cost" required readonly>

          <div class="button-group">
            <button type="button" @click="cancelAddLease" class="cancel-button">Cancel</button>
            <button type="submit" class="add-lease-button">Add Lease</button>
          </div>
        </form>
      </div>
      
      <section class="leases-list">
        <article v-for="lease in leases" :key="lease.id" class="lease-card">
          <div class="card-content">
            <p><strong>Rental ID:</strong> {{ lease.rentalId }}</p>
            <p><strong>Tenant ID:</strong> {{ lease.tenantId }}</p>
            <p><strong>Start Date:</strong> {{ formatDate(lease.startDate) }}</p>
            <p><strong>End Date:</strong> {{ formatDate(lease.endDate) }}</p>
            <p><strong>Rent Amount:</strong> {{ lease.rentAmount }}</p>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue';
  import { Lease, Rental } from '../type';
  import { fetchLeases, fetchRentals } from '../services';
  import navBar from '../components/nav-bar.vue';

  const leases = ref<Lease[]>([])
  const showAddLeaseForm = ref(false)
  const rentals = ref<Rental[]>([])
  const selectedCost = ref<number | null>(null)
  const newLease = ref<Partial<Lease>>({
    rentalId: 0,
    tenantId: 0,
    startDate: '',
    endDate: '',
    rentAmount: '0'
  })

  const loadData = async () => {
    try {
      rentals.value = await fetchRentals()
      leases.value = await fetchLeases()
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const addLease = async () => {
    try {
      console.log('Adding lease...')
      // Implement your logic to add the lease
    } catch (error) {
      console.error('Error adding lease:', error)
    }
  }

  const toggleAddLeaseForm = () => {
    showAddLeaseForm.value = !showAddLeaseForm.value
  }

  const cancelAddLease = () => {
    showAddLeaseForm.value = false
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
    return date.toLocaleDateString('en-GB', options)
  }

  const vacantProperties = computed(() => {
    return rentals.value.filter(rental => rental.status === 'VACANT')
  })

  const updateEndDate = () => {
    if (newLease.value.startDate) {
      const startDate = new Date(newLease.value.startDate)
      const endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate())
      newLease.value.endDate = endDate.toISOString().split('T')[0]
    }
  }

  watch(() => newLease.value.rentalId, (newVal) => {
    const selectedProperty = rentals.value.find(rental => rental.id === newVal)
    if (selectedProperty) {
      selectedCost.value = parseFloat(selectedProperty.cost.toString().replace(/[^0-9.-]+/g, "")) / 100
    } else {
      selectedCost.value = null
    }
  })

  onMounted(() => {
    loadData()
  })
</script>

<style scoped>
  @import '../styles/style.css';
  @import '../styles//leaseList.css';
</style>
