export class ErrorGenerator {
    private lastError: string;
    constructor() {
        this.lastError = "";
    }
    checKIfValidToken(token: string) {
        if (!token) {
            this.lastError = "email o password non valida";
            throw new Error(this.lastError); 
        }
    }
    getLastError() {
        return this.lastError;
    }
}