export function startDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("cacaDB", 2)

        request.onupgradeneeded = (evento) => {
            const db = evento.target.result
            
            // Cria a tabela eventos se não existir
            if (!db.objectStoreNames.contains("eventos")) {
                db.createObjectStore("eventos", { keyPath: "id", autoIncrement: true })
            }
            
            // Cria a tabela newsletter se não existir
            if (!db.objectStoreNames.contains("subscritores")) {
                db.createObjectStore("subscritores", { keyPath: "email" }) // email é o unico id
            }
        }

        request.onsuccess = (evento) => {
            resolve(evento.target.result) // retorna à bd
        }

        request.onerror = (evento) => {
            reject("Erro ao abrir a base de dados: " + evento.target.errorCode)
        }
    })
}


// add Evento à base de dados
export function addEventDB(db, evento) {
    return new Promise((resolve, reject) => {
        const transacao = db.transaction(["eventos"], "readwrite")
        const store = transacao.objectStore("eventos")
        
        const request = store.add(evento)

        request.onsuccess = () => resolve("Evento adicionado com sucesso!")
        request.onerror = () => reject("Erro ao adicionar evento à base de dados.")
    })
}


// add subscritor à base de dados
export function addSubscritorDB(db, subscritor) {
    return new Promise((resolve, reject) => {
        const transacao = db.transaction(["subscritores"], "readwrite")
        const store = transacao.objectStore("subscritores")
        
        const request = store.add(subscritor) // erro se o email já existir

        request.onsuccess = () => resolve("Subscritor adicionado com sucesso!");
        request.onerror = () => reject("Este e-mail já se encontra registado na nossa Newsletter.");
    })
}
export function getEventosDB(db) {
    return new Promise((resolve, reject) => {
        const transacao = db.transaction(["eventos"], "readonly")
        const store = transacao.objectStore("eventos")
        const request = store.getAll()

        request.onsuccess = (evento) => resolve(evento.target.result) // retorna a lista de eventos
        request.onerror = () => reject("Erro ao obter eventos da base de dados.")
    })
}
