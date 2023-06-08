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

export default {
    name: "index",
    components: {FontAwesomeIcon},
    data() {
        return {
            weather: {
                city: 'Salvador',
                country: 'BA',
                temperature: 12,
                description: 'Nuvens por todo lugar',
                lowTemp: '19',
                highTemp: '30',
                feelsLike: '20',
                humidity: '55'
            },
            weatherRoute: 'http://api.weatherapi.com/v1'
        }
    },
    methods: {
        getWeather() {
            const baseURL = `${this.weatherRoute + '/current.json'}`
        }
    },
};
</script>

<style scoped></style>
