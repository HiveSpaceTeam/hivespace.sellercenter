<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-7">
        <ecommerce-metrics />
        <monthly-sale />
      </div>
      <div class="col-span-12 xl:col-span-5">
        <monthly-target />
      </div>

      <div class="col-span-12">
        <statistics-chart />
      </div>

      <div class="col-span-12 xl:col-span-5">
        <customer-demographic />
      </div>

      <div class="col-span-12 xl:col-span-7">
        <recent-orders />
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import EcommerceMetrics from '@/views/Demo/Ecommerce/EcommerceMetrics.vue'
import MonthlyTarget from '@/views/Demo/Ecommerce/MonthlyTarget.vue'
import MonthlySale from '@/views/Demo/Ecommerce/MonthlySale.vue'
import CustomerDemographic from '@/views/Demo/Ecommerce/CustomerDemographic.vue'
import StatisticsChart from '@/views/Demo/Ecommerce/StatisticsChart.vue'
import RecentOrders from '@/views/Demo/Ecommerce/RecentOrders.vue'
export default {
  components: {
    AdminLayout,
    EcommerceMetrics,
    MonthlyTarget,
    MonthlySale,
    CustomerDemographic,
    StatisticsChart,
    RecentOrders,
  },
  name: 'Ecommerce',
}
</script>
