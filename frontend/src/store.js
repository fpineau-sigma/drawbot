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
      this._vm.$socket.client.emit("pen", state.penUp ? "up" : "down");
    },
    SOCKET_PEN_UPDATE(state, pen) {
      state.penUp = pen === "up";
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
