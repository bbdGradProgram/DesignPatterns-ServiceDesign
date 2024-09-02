export default {
    getToken() {
        return localStorage.getItem('id_token');
    },
    setToken(token: string) {
        localStorage.setItem('id_token', token);
    },
    clearToken() {
        localStorage.removeItem('id_token');
    },
    isAuthenticated() {
        return !!this.getToken();
    },
    logout() {
        this.clearToken();
    }
};
