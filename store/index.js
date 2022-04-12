export const state = () => ({
  token: null,
});

export const getters = {
  hasToken(state) {
    return state.token
  }
}

export const mutations = {
  setToken(state, token) {
    state.token = token
  }
}

export const actions = {
//TODO ajax here
}


