import { makeAutoObservable } from "mobx";
class AuthStore { 
    user = null
    token = null
    error = null
    isAuthenticated = false
    constructor() {
        makeAutoObservable(this)
    }
    login = async (username, password) => { 
        if(username === 'admin' && password === 'admin123') {
            this.user = { username }
            this.token = 'fake-jwt-token'
            this.isAuthenticated = true
        }
        else {
            this.error = 'Invalid username or password'
        }
    }
    logout = () => { 
        this.user = null
        this.token = null
        this.isAuthenticated = false
        this.error = null
    }
    isAuthenticated = () => { 
        return this.token !== null
    }
}
export default new AuthStore()