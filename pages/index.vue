<template>
    <div class="flex flex-col min-h-screen bg-[#0E1A2A]">
        <header class="sticky top-0 bg-21394F"></header>
        <div class="text-white">
            <div class="flex items-center gap-3 flex-1">
                <font-awesome-icon :icon="['fas','sun']"/>
                <p class="text-2xl">{{ weather.city }}</p>
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
            weather: {},
            weatherBaseRoute: 'https://api.weatherapi.com/v1',
            weatherKey: '953c9a5eae1041bca6b195920230806'
        }
    },
    mounted() {
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
                        q: `${latitude},${longitude}` // Adicione as coordenadas lat e long como parâmetros, se necessário
                    }
                }).then((response) => {
                    this.weather.city = response.data.location.name
                    this.weather.country = response.data.location.country
                    console.log(response.data.location);
                })
            } catch (error) {
                console.error(error);
            }
        }
    },
};
</script>

<style scoped></style>
