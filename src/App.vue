<script setup>
import { ref, onMounted, onUnmounted} from "vue";
import ProductionChart from "./components/ProductionChart.vue";

const machines = ref([]);
const productionHistory = ref([]); //store production count of M1
let intervalId = null;
const lastUpdated = ref(null);

const fetchMachines = async () => {
  console.log("fetchMachines called"); // 👈 first check

  try {
    const res = await fetch("http://localhost:4000/machines");
    console.log("Fetch response status:", res.status); // 👈 check backend response

    const data = await res.json();
    machines.value = data;
    lastUpdated.value = new Date().toLocaleTimeString();

    // track production count of Machine 1
    if (data.length > 0) {
      const newHistory = [...productionHistory.value];
      newHistory.push({
        time: new Date().toLocaleTimeString(),
        value: data[0].productionCount
      });


      if(newHistory.length > 20){
        newHistory.shift();
      }
      productionHistory.value = newHistory;
    }

    // Debug log for chart
    console.log("Passing to chart:", productionHistory.value);

  } catch (err) {
    console.error("Failed to fetch machines:", err);
  }
};


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
    <h2 class="text-center mt-5">Machine 1 Production Over Time</h2>
    <div class="card shadow-lg border-0 rounded-4 p-3">
      <ProductionChart :data="productionHistory"/>
    </div>
  </div>
</template>

<style scoped>

</style>
