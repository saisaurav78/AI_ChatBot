import { makeAutoObservable } from "mobx";    
class ChatStore { 
    messages = [
        { text: "Hello! How can I assist you today?", sender: "AI" },
        { text: "I'm here to help you with your queries.", sender: "AI" },
        { text: "Feel free to ask me anything!", sender: "AI" }
    ]
    loading = false
    constructor() {
        makeAutoObservable(this)
    }
    addMessage = (message) => { 
        this.messages.push(message)
    }   
    setLoading = (status) => { 
        this.loading = status
    }
    clearMessages = () => { 
        this.messages = []
    }
}
const chatStore = new ChatStore()
export default chatStore