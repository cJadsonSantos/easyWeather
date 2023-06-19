import { defineStore } from 'pinia'

export const useCityStore = defineStore('city', {
  state: () => ({
    cityName: ''
  }),
  getters: {
    getCityName(state) {
      return state.cityName
    }
  },
  actions: {
    setCityName(name) {
      this.cityName = name
    }
  }
})
