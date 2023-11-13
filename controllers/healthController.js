exports.checkHealth = async (req, res) => {
    res.send('The server is up and running currently on: ' +  new Date())
}

