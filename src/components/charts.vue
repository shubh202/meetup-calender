<template>
<div id="chart">
        <apexchart type="pie" width="380" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
    components: {
          apexchart: VueApexCharts,
        },
  data: () => ({
    colorMap:{
        'High': 'ff0019',
        'Medium': 'fbff00',
        'Low': '5e8000'
    },
    series: [1,2,3],
    chartOptions: {
        chart: {
            width: 380,
             type: 'pie',
            },
        labels: ['High','Medium','Low'],
        colors:['#ff0019', '#fbff00', '#5e8000'],
        responsive: [{
            breakpoint: 480,
            options: {
               chart: {
                 width: 200
                },
               legend: {
                 position: 'bottom'
                }
            }
        }]
    },
  }),
  mounted () {
    this.getPriorityList();
  },
    methods: {
    getPriorityList () {
      let eventList = localStorage.getItem('eventsList');
      if(eventList){
        let ev = JSON.parse(eventList);
        let listMap = ev.map(p => p.color);
        this.getOccurance(listMap);
      }
      else{
        this.series = [];
      }
    },
    getOccurance(list){
        let seriesTemp = [0,0,0]; // initial Array
        let colorObject = this.colorMap;
        list.forEach(element => {
            if(element === `#${colorObject['High']}`) {
                seriesTemp[0] = seriesTemp[0] + 1;
            }
            if(element === `#${colorObject['Medium']}`) {
                seriesTemp[1] = seriesTemp[1] + 1;
            }
            if(element === `#${colorObject['Low']}`) {
                seriesTemp[2] = seriesTemp[2] + 1;
            }
        });
        this.series = [...seriesTemp];
    }
  }
}
</script>