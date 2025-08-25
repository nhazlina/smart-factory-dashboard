<script setup>
import { computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register required chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

// Chart.js format
const chartData = computed(() => ({
  labels: props.data.map(d => d.time),
  datasets: [
    {
      label: "Production Count",
      data: props.data.map(d => d.value),
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      tension: 0.3,
      fill: true,
      pointRadius: 5,
      pointBackgroundColor: "#4bc0c0",
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {position: "top" },
    title: {display: true, text: "Production Trend" },
  }
};
</script>

<template>
  <div style="height: 400px;">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
