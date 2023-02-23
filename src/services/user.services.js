const validatingFields = (title,description,priority) =>{
    if (!title || !description || !priority) {
        throw new Error("Title , Description and priority should be valid", {
            cause: { status: 400 }
        })
    }
}

module.exports = {validatingFields}