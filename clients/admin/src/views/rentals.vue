<template>
  <navBar />
  <section class="rentals-container">
    <header>
      <h2>Rentals</h2>
    </header>
    <div class="filter-add-container">
      <div class="filter-container">
        <label for="statusFilter">Filter by Status:</label>
        <select v-model="statusFilter" id="statusFilter" @change="applyStatusFilter">
          <option value="all">All</option>
          <option value="occupied">Occupied</option>
          <option value="vacant">Vacant</option>
        </select>
      </div>
      <button @click="toggleAddRentalForm" class="add-rental-button">Add Rental</button>
    </div>

    <div v-if="showAddRentalForm" class="overlay">
      <form @submit.prevent="handleAddRental" class="add-rental-form">
        <h3>Add New Rental</h3>

        <label for="propertyId">Select Property:</label>
        <select v-model="newRental.propertyId" id="propertyId" required>
          <option v-for="property in vacantRentals" :key="property.id" :value="property.propertyId">
            {{ property.propertyId }}
          </option>
        </select>

        <label for="cost">Rent Amount:</label>
        <input type="number" id="cost" v-model="newRental.cost" required>

        <div class="button-group">
          <button type="button" @click="cancelRentalForm" class="form-button cancel-button">Cancel</button>
          <button type="submit" class="form-button add-rental-button">Add Rental</button>
        </div>
      </form>
    </div>

    <section class="rental-list">
      <article v-for="rents in filteredRentals" :key="rents.id" class="rental-card">
        <div class="card-content">
          <p><strong>Rental ID:</strong> {{ rents.id }}</p>
          <p><strong>Property ID:</strong> {{ rents.propertyId }}</p>
          <p><strong>Status:</strong> {{ rents.status }}</p>
          <p><strong>Cost:</strong> {{ rents.cost }}</p>
        </div>
      </article>
    </section>
  </section>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import navBar from '../components/nav-bar.vue';
  import { Rental } from '../type';
  import { fetchRentals } from '../services';

  const rentals = ref<Rental[]>([])
  const showAddRentalForm = ref(false)
  const statusFilter = ref<string>('all')
  const newRental = ref<Partial<Rental>>({ propertyId: '', cost: 0, statusId: 1 })

  const loadRentals = async () => {
    try {
      rentals.value = await fetchRentals()
    } catch (error) {
      console.error('Error loading rentals:', error)
    }
  }

  const toggleAddRentalForm = () => {
    showAddRentalForm.value = !showAddRentalForm.value
  }

   const handleAddRental = async () => {
    try {
      console.log("test add rental")
    } catch (error) {
      console.error('Error adding rental:', error)
    }
  }

  const cancelRentalForm = () => {
    showAddRentalForm.value = false
  }
  const vacantRentals = computed(() => {
    return rentals.value.filter(rental => rental.status === 'VACANT').map(rental => ({
      id: rental.id,
      propertyId: rental.propertyId,
    }))
  })

  const applyStatusFilter = () => {
    if (statusFilter.value === 'all') {
      return rentals.value
    } else {
      return rentals.value.filter(rental => rental.status.toLowerCase() === statusFilter.value)
    }
  }

  const filteredRentals = computed(() => {
    return applyStatusFilter()
  })

  onMounted(() => {
    loadRentals()
  })
</script>

<style scoped>
  @import '../styles/style';
  @import '../styles/rentals';
</style>
