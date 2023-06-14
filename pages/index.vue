<template>
  <div v-if="show"
       :class="gradientClass"
       class="flex flex-col h-screen w-screen min-h-screen text-[#F3F3F3] overflow-scroll sm:h-screen">
    <div class="flex flex-col items-center justify-center">

      <div class="text-center mt-12 items-center space-y-12">
        <font-awesome-icon :icon="iconWeather" class="text-7xl" bounce />
        <p class="text-4xl font-bold">{{ weather.city }}</p>
        {{ formatDateBrazilian(forecastDays[countDays].date) }}
      </div>

      <div class="text-center space-y-4 mt-4">
        <span class="flex flex-col justify-center">
          <font-awesome-icon :icon="['fas','wind']" class="text-2xl" fade />
          {{ weather.wind_dir }}
        </span>
        <span class="flex flex-col justify-center">
          <font-awesome-icon :icon="['fas','bolt']" class="text-2xl" fade />
          {{ weather.wind_kph }} km/h
        </span>
        <p class="text-5xl font-bold">{{ `${weather.temp_c}º` }}</p>
        <p class="text-2xl text-gray-300">{{ weather.condition }}</p>
      </div>

      <input
        type="text"
        v-model="city"
        placeholder="Buscar Cidade..."
        class="mt-4 w-80 px-8 py-2 border border-none rounded-full bg-[#0E1A2A] text-[#F3F3F3] bg-opacity-90"
        @input="searchWeather"
      />
      <div class="flex flex-wrap max-w-full px-8 mt-8">
        <div class="flex overflow-x-auto">
          <template v-for="day in forecastDays[countDays].hour" :key="day.id">
            <div class="flex flex-col items-center justify-center ml-4">
              <font-awesome-icon :icon="getIcon(day.condition.code,day.condition.icon)" class="text-1xl" fade />
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
        Dia Anterior
      </span>
      <span @click="changeDate(1)" class="cursor-pointer flex items-center justify-center">
        Próximo Dia
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
  computed: {
    gradientClass() {
      const now = new Date();
      const hour = now.getHours();
      return hour < 12 ? "bg-gradient-to-r from-[#E95D55] to-[#ED693D]" : "bg-gradient-to-r from-[#21394F] to-[#0E1A2A]";
    }
  },
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
      weatherKey: "fa717ecfdc814ba7928232204231306"
    };
  },
  created() {
    this.getCurrentLocation();
    this.getCurrentDate();
  },
  methods: {
    async getCurrentLocation() {
      try {
        const response = await axios.get("https://ipapi.co/json/");
        const { latitude, longitude } = response.data;

        await this.getWeather(latitude, longitude);
      } catch (error) {
        console.error("Erro ao obter a localização:", error);
      }
    },


    async getWeather(latitude, longitude) {
      try {
        await axios.get(`${this.weatherBaseRoute}/forecast.json`, {
          params: {
            key: this.weatherKey,
            q: `${latitude}, ${longitude}`,
            days: 4,
            lang: "pt"
          }
        })
          .then((response) => {
            this.weather.city = response.data.location.name;
            this.weather.condition = response.data.current.condition.text;
            this.weather.temp_c = response.data.current.temp_c;
            this.weather.wind_kph = response.data.current.wind_kph;
            this.weather.wind_dir = response.data.current.wind_dir;
            console.log(response.data.current);
            this.show = true;

            this.forecastDays = response.data.forecast.forecastday;

            if (response.data.current.condition.code) {
              this.iconWeather = this.getIcon(response.data.current.condition.code, response.data.current.condition.icon);
            }
          });
      } catch (error) {
        console.error(error);
      }
    },


    async searchWeather() {
      if (!this.city) {
        await this.getCurrentLocation();
      }
      await axios.get(`${this.weatherBaseRoute}/forecast.json`, {
        params: {
          key: this.weatherKey,
          q: `${this.city}`
        }
      })
        .then((response) => {
          this.iconWeather = this.getIcon(response.data.current.condition.code, response.data.current.condition.icon);
          this.weather.city = response.data.location.name;
          this.weather.condition = response.data.current.condition.text;
          this.weather.temp_c = response.data.current.temp_c;
          this.weather.wind_kph = response.data.current.wind_kph;
          this.weather.wind_dir = response.data.current.wind_dir;
        }).then(() => {
          this.updateWeather();
        });
    },

    async updateWeather() {
      try {
        await axios.get(`${this.weatherBaseRoute}/forecast.json`, {
          params: {
            key: this.weatherKey,
            q: this.city,
            days: 4,
            aqi: "yes",
            lang: "pt"
          }
        }).then((response) => {
          this.weather.city = response.data.location.name;
          this.weather.condition = response.data.current.condition.text;
          this.weather.temp_c = response.data.current.temp_c;

          this.forecastDays = response.data.forecast.forecastday;

          if (response.data.current.condition) {
            if (response.data.current.condition.code) {
              this.iconWeather = this.getIcon(response.data.current.condition.code, response.data.current.condition.icon);
            }
          }
        });
      } catch (error) {
        console.error(error);
      }
    },

    getCurrentDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      this.currentDate = `${day}/${month}/${year}`;
    },

    getIcon(code, icon) {
      if (icon.includes("day")) {
        let codeDay = code += "day";
      }
      const iconMap = {
        1003: ["fas", "cloud-moon"],
        "1003day": ["fas", "cloud-sun"],
        1000: ["fas", "moon"],
        "1000day": ["fas", "sun"],
        1006: ["fas", "cloud"],
        "1006day": ["fas", "cloud"],
        1063: ["fas", "cloud-moon-rain"],
        "1063day": ["fas", "cloud-sun-rain"],
        1240: ["fas", "cloud-rain"],
        "1240day": ["fas", "cloud-sun-rain"],
        "1243day": ["fas", "cloud-sun-rain"],
        1243: ["fas", "cloud-moon-rain"],
        "1246day": ["fas", "cloud-sun-rain"],
        1009: ["fas", "water"],
        "1009day": ["fas", "water"],
        1183: ["fas", "cloud-rain"],
        "1183day": ["fas", "cloud-rain"],
        1153: ["fas", "cloud-rain"],
        "1153day": ["fas", "cloud-rain"],
        1030: ["fas", "smog"],
        "1030day": ["fas", "smog"]
      };

      if (code in iconMap) {
        return iconMap[code];
      } else {
        // console.log("error:", code);
      }
    },

    changeDate(days) {
      this.countDays += days;
      if (this.countDays < 0) {
        this.countDays = 0;
      } else if (this.countDays >= this.forecastDays.length) {
        this.countDays = this.forecastDays.length - 1;
      }
    },
    formatDateBrazilian(date) {
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    }
  }
};
</script>
