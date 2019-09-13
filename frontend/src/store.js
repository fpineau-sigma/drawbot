import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    penUp: true,
    controlSteps: 10,
    latestInput: null,
    file: null
  },
  mutations: {
    CONTROL_STEPS(state, steps) {
      state.controlSteps = steps;
    },
    UPDATE_KEY(state, { key, value }) {
      state[key] = value;
    },
    TOGGLE_PEN(state) {
      state.penUp = !state.penUp;
      this._vm.$socket.client.emit("penUp", state.penUp);
    },
    SOCKET_PEN_UP(state, isUp) {
      state.penUp = isUp;
    },
    LATEST_INPUT(state, input) {
      state.latestInput = input;
    },
    SELECTED_FILE(state, file) {
      state.file = file;
    }
  },
  actions: {
    togglePen({ commit }) {
      commit("TOGGLE_PEN");
    }
  }
});
