class UnsuportedCommand extends Error {
    constructor(message) {
        super();
        this.message = message;
        this.code = 404;
        this.type = "UnsuportedCommand";
    }
}

function ErrorHandler(err) {
    return "Error";
}

module.exports = {
    ErrorHandler,
    UnsuportedCommand
}