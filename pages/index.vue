<template>
    <div v-if="show"
         class="flex flex-col h-screen min-h-screen bg-gradient-to-r from-[#0E1A2A] to-[#21394F] text-[#F3F3F3]">
        <div class="h-1/2 flex flex-col items-center justify-center">
            <div class="text-center mt-12 items-center space-y-12">
                <font-awesome-icon :icon="['fas','cloud-sun']" class="text-7xl" bounce/>
                <p class="text-4xl font-bold">{{ weather.city }}</p>
            </div>
            <div class="text-center space-y-2 mt-4">
                <p class="text-5xl font-bold">{{ `${weather.temp_c}º` }}</p>
                <p class="text-2xl text-gray-400">{{ weather.condition }}</p>
            </div>
        </div>


        <div>
            <ul class="divide-y divide-[#F3F3F3] p-2">
                <li class="py-2">Dia 1</li>
                <li class="py-2">Dia 2</li>
                <li class="py-2">Dia 3</li>
            </ul>
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
            weatherBaseRoute: 'https://api.weatherapi.com/v1',
            weatherKey: '953c9a5eae1041bca6b195920230806'
        }
    },
    created() {
        this.getCurrentLocation();
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
                await axios.get(`${this.weatherBaseRoute}/current.json`, {
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
                    this.weather.country = response.data.location.country
                    this.weather.condition = response.data.current.condition.text
                    this.weather.temp_c = response.data.current.temp_c
                    this.show = true
                    console.log(response.data);
                })
            } catch (error) {
                console.error(error);
            }
        }
    },
};
</script>

<style scoped></style>
