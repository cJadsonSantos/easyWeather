<template>
  <div v-if="show"
       class="flex flex-col h-screen w-screen min-h-screen bg-gradient-to-r from-[#0E1A2A] to-[#21394F] text-[#F3F3F3] overflow-hidden sm:h-screen">
    <div class="flex flex-col items-center justify-center">

      <div class="text-center mt-12 items-center space-y-12">
        <font-awesome-icon :icon="['fas',iconWeather]" class="text-7xl" bounce />
        <p class="text-4xl font-bold">{{ weather.city }}</p>
      </div>

      <div class="text-center space-y-2 mt-4">
        <p class="text-5xl font-bold">{{ `${weather.temp_c}º` }}</p>
        <p class="text-2xl text-gray-400">{{ weather.condition }}</p>
      </div>

      <input
        type="text"
        v-model="city"
        placeholder="Search City.."
        class="mt-4 w-80 px-8 py-2 border border-none rounded-full bg-[#0E1A2A] text-[#F3F3F3]"
        @input="searchWeather"
      />
      <div class="flex flex-wrap max-w-full px-8 mt-8">
        <div class="flex overflow-x-auto">
          <template v-for="day in forecastDays[countDays].hour" :key="day.id">
            <div class="flex flex-col items-center justify-center ml-4">
              <font-awesome-icon :icon="getIcon(day.condition.text)" class="text-1xl" fade />
              <div class="text-left text-xs">
                <p>{{ day.time.slice(11, 16) }}</p>
                <p>{{ `${day.temp_c}º` }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-8 space-x-8 text-sm font-bold">
      <span @click="changeDate(-1)" class="cursor-pointer flex items-center justify-center">
        <font-awesome-icon :icon="['fas','caret-left']" class="text-2xl mr-2" beat />
        Previous Day
      </span>
      <span @click="changeDate(1)" class="cursor-pointer flex items-center justify-center">
        Next Day
        <font-awesome-icon :icon="['fas','caret-right']" class="text-2xl ml-2" beat />
      </span>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axios from "axios";

export default {
  name: "index",
  components: { FontAwesomeIcon },
  data() {
    return {
      show: false,
      weather: {},
      forecastDays: {},

      city: null,
      currentDate: null,
      iconWeather: null,

      countDays: 0,

      weatherBaseRoute: "https://api.weatherapi.com/v1",
      weatherKey: "953c9a5eae1041bca6b195920230806"
    };
  },
  created() {
    this.getCurrentLocation();
    this.getCurrentDate();
  },
  methods: {
    // async getCurrentLocation() {
    //   try {
    //     const position = await new Promise((resolve, reject) => {
    //       navigator.geolocation.getCurrentPosition(resolve, reject);
    //     });
    //
    //     const { latitude, longitude } = position.coords;
    //     await this.getWeather(latitude, longitude);
    //   } catch (error) {
    //     console.error("Erro ao obter a localização:", error);
    //   }
    // },

    async getCurrentLocation() {
      try {
        // Obter o endereço IP usando o serviço "ipify"
        const response = await axios.get("https://api.ipify.org?format=json");
        const ipAddress = response.data.ip;

        // Chame a função para obter o clima com base no endereço IP
        await this.getWeather(ipAddress);
      } catch (error) {
        console.error("Erro ao obter a localização:", error);
      }
    },


    async getWeather(ipAddress) {
      try {
        await axios
          .get(`${this.weatherBaseRoute}/forecast.json`, {
            params: {
              key: this.weatherKey,
              q: ipAddress,
              days: 3,
              aqi: "yes",
              alerts: "yes"
            }
          })
          .then((response) => {
            this.weather.city = response.data.location.name;
            this.weather.condition = response.data.current.condition.text;
            this.weather.temp_c = response.data.current.temp_c;
            this.show = true;

            this.forecastDays = response.data.forecast.forecastday;

            if (response.data.current.condition) {
              this.iconWeather = "cloud-moon";
            }
          });
      } catch (error) {
        console.error(error);
      }
    },

    async searchWeather() {
      await axios
        .get(`${this.weatherBaseRoute}/forecast.json`, {
          params: {
            key: this.weatherKey,
            q: `${this.city}`
          }
        })
        .then((response) => {
          this.weather.city = response.data.location.name;
          this.weather.condition = response.data.current.condition.text;
          this.weather.temp_c = response.data.current.temp_c;
          // this.forecastDays = response.data.forecast.forecastday;
          console.log(response.data);
        });
    },

    getCurrentDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      this.currentDate = `${day}/${month}/${year}`;
    },

    getIcon(condition) {
      const iconMap = {
        "Partly cloudy": ["fas", "cloud-moon"],
        "Sunny": ["fas", "sun"],
        "Clear": ["fas", "moon"],
        "Cloudy": ["fas", "cloud"],
        "Patchy rain possible": ["fas", "cloud-moon-rain"]
      };

      if (condition in iconMap) {
        return iconMap[condition];
      } else {
        console.log("Unknown weather condition:", condition);
      }
    },

    changeDate(days) {
      this.countDays += days;

      if (this.countDays < 0) {
        this.countDays = 0;
      } else if (this.countDays >= this.forecastDays.length) {
        this.countDays = this.forecastDays.length - 1;
      }
    }
  }
};
</script>
