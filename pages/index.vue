<template>
    <div v-if="show"
         class="flex flex-col h-screen w-screen min-h-screen bg-gradient-to-r from-[#0E1A2A] to-[#21394F] text-[#F3F3F3] sm:h-screen">
        <div class="flex flex-col items-center justify-center">

            <div class="text-center mt-12 items-center space-y-12">
                <font-awesome-icon :icon="['fas','cloud-sun']" class="text-7xl" bounce/>
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
                    <template v-for="day in currencyDayForecastHour" :key="day.id">
                        <div class="flex flex-col items-center justify-center ml-4">
                            <font-awesome-icon :icon="['fas','cloud']" class="text-1xl" fade/>
                            <div class="text-left text-xs">
                                <p>{{ day.time.slice(11, 16) }}</p>
                                <p>{{ `${day.temp_c}º` }}</p>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import axios from "axios";

export default {
    name: "index",
    components: {FontAwesomeIcon},
    data() {
        return {
            show: false,
            weather: {},
            currencyDayForecastHour: {},

            city: null,
            currentDate: null,

            weatherBaseRoute: 'https://api.weatherapi.com/v1',
            weatherKey: '953c9a5eae1041bca6b195920230806'
        }
    },
    created() {
        this.getCurrentLocation();
        this.getCurrentDate();
    },
    methods: {
        async getCurrentLocation() {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });

                const {latitude, longitude} = position.coords;
                await this.getWeather(latitude, longitude);
            } catch (error) {
                console.error('Erro ao obter a localização:', error);
            }
        },

        async getWeather(latitude, longitude) {
            try {
                await axios.get(`${this.weatherBaseRoute}/forecast.json`, {
                    params: {
                        key: this.weatherKey,
                        q: `${latitude},${longitude}`,
                        days: 7,
                        aqi: 'yes',
                        alerts: 'yes'
                        // dt: '2023-07-09',
                    }
                }).then((response) => {
                    this.weather.city = response.data.location.name
                    this.weather.condition = response.data.current.condition.text
                    this.weather.temp_c = response.data.current.temp_c
                    this.show = true

                    this.currencyDayForecastHour = response.data.forecast.forecastday[0].hour
                    console.log(response.data.forecast.forecastday[0].hour);
                })
            } catch (error) {
                console.error(error);
            }
        },

        async searchWeather() {
            await axios.get(`${this.weatherBaseRoute}/current.json`, {
                params: {
                    key: this.weatherKey,
                    q: `${this.city}`,
                }
            }).then(response => {
                this.weather.city = response.data.location.name;
                this.weather.condition = response.data.current.condition.text
                this.weather.temp_c = response.data.current.temp_c
                console.log(response.data)
            })
        },

        getCurrentDate() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            this.currentDate = `${day}/${month}/${year}`;
        }

    },
};
</script>

<style scoped></style>
