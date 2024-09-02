import { reactive } from 'vue';

const state = reactive({
    unauthorizedMessage: '',
});

export default {
    get unauthorizedMessage() {
        return state.unauthorizedMessage;
    },
    setUnauthorizedMessage(message: string) {
        state.unauthorizedMessage = message;
    },
    clearUnauthorizedMessage() {
        state.unauthorizedMessage = '';
    },
};
