<script setup>
import { ref, onMounted, onUnmounted, watch} from "vue";
import ProductionChart from "./components/ProductionChart.vue";

const machines = ref([]);
const productionHistory = ref([]); //store production count of M1
const selectedMachineId = ref(1); //default to Machine 1
let intervalId = null;
const lastUpdated = ref(null);

const fetchMachines = async () => {

  try {
    const res = await fetch("http://localhost:4000/machines");
    const data = await res.json();
    machines.value = data;
    lastUpdated.value = new Date().toLocaleTimeString();

    // track selected machine history
    const selectedMachine = data.find(m => m.id === selectedMachineId.value);
    if(selectedMachine){
      const newHistory = [...productionHistory.value];
      newHistory.push({
        time: `T${newHistory.length + 1}`,
        value: selectedMachine.productionCount
      });
      if (newHistory.length > 20) newHistory.shift();
      productionHistory.value = newHistory;
    }
  } catch (err) {
    console.error("Failed to fetch machines:", err);
  }
};

watch(selectedMachineId,() =>{
  productionHistory.value = []; //reset when switching
  fetchMachines();
});


onMounted(() => {
  fetchMachines(); //fetch once on load
  intervalId = setInterval(fetchMachines, 10000); //auto refrech every 10S
});

onUnmounted(() =>{
  clearInterval(intervalId); //clean up when component is destroyed
});
</script>

<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">Smart Factory Dashboard</h1>
    <p class="text-center text-muted">Last updated: {{ lastUpdated }}</p>

    <!--Machine Cards-->
    <div class="row">
      <div class="col-md-4 mb-3" v-for="machine in machines" :key="machine.id">
        <div class="card shadow-lg border-0 rounded-4">
          <div class="card-body text-center">
            <h5 class="card-title">Machine {{ machine.id }}</h5>
            <p>
              <strong>Temp: </strong> {{ machine.temperature }} °C <br />
              <strong>Uptime: </strong> {{ machine.uptime }} hrs <br />
              <strong>Power: </strong> {{ machine.power }} W <br />
              <strong>Production: </strong> {{ machine.productionCount }} 
            </p>
            <span
              class="badge px-3 py-2"
              :class="machine.status === 'OK' ? 'bg-success' : 'bg-danger'"
              >
              {{ machine.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!--Chart-->
    <h2 class="text-center mt-5"> Machine {{ selectedMachineId }} Production Over Time</h2>

    <!-- Dropdown-->
    <div class="text-center mb-3">
      <label class="me-2 fw-bold">Select Machine:</label>
      <select v-model="selectedMachineId" class="form-select w-auto d-inline-block">
        <option v-for="machine in machines" :key="machine.id" :value="machine.id">
          Machine {{ machine.id }}
        </option>
      </select>
    </div>

    <div class="card shadow-lg border-0 rounded-4 p-3">
      <ProductionChart :data="productionHistory"/>
    </div>
  </div>
</template>

<style scoped>

</style>
