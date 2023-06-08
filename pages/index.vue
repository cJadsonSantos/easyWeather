<template>
    <div class="flex flex-col min-h-screen bg-[#0E1A2A]">
        <header class="sticky top-0 bg-21394F"></header>
        <div class="text-white">
            <div class="flex items-center gap-3 flex-1">
                <font-awesome-icon :icon="['fas','sun']"/>
                <p class="text-2xl">The Local Weather</p>
            </div>
        </div>
    </div>
</template>

<script>

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
    name: "index",
    components: {FontAwesomeIcon},
};
</script>

<style scoped></style>
