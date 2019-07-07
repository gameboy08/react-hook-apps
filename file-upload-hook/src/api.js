const api = {
    uploadFile: ( {timeout = 550} ) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, timeout)
        })
    }
}
export default api;