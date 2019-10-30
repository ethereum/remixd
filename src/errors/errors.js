class UnsuportedCommandError extends Error {
    constructor(message) {
        super();
        this.message = message;
        this.code = 404;
        this.type = "UnsupportedCommandError";
    }
}

module.exports = {
    UnsuportedCommandError
}