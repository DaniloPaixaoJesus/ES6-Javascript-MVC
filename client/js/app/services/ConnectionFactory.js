//cria funcao anonima e auto invoca-a ==: (function(){ ...; ...;})();
//var ConnectionFactory com escopo global
//aplicacao do padrão Module Pattern, transformou a classe em um modulo 
var ConnectionFactory = (function(){
    
    const stores = ['negociacoes'];
    const version = 1;
    const dbName = 'negociacaoframe';
    
    var connection = null;
    var closeOriginal = null;
    
    //Module Pattern
    return class ConnectionFactory {

        constructor() {
            throw new Error('Não é possível criar instâncias de ConnectionFactory');
        }

        //return a Promise
        static getConnection() {

            return new Promise((resolve, reject) => {

                let openRequest = window.indexedDB.open(dbName,version);

                openRequest.onupgradeneeded = e => {
                    //e.target.result ==> conection
                    ConnectionFactory._createStores(e.target.result);
                };

                openRequest.onsuccess = e => {    
                    if(!connection){//em javascript nulo, undefined, '' => false 
                        connection = e.target.result;
                        // a conexao nao pode ser fechada diretamente, reescreve o metodo close
                        closeOriginal = connection.close.bind(connection);
                        connection.close = function() {
                            throw new Error('Você não pode fechar diretamente a conexão');
                        };
                    }
                    resolve(connection);
                };

                openRequest.onerror = e => {    
                    console.log(e.target.error);
                    reject(e.target.error.name);
                };
            });
        }

        static _createStores(connection) {
            stores.forEach(store => {
                if(connection.objectStoreNames.contains(store)) connection.deleteObjectStore(store);
                connection.createObjectStore(store, { autoIncrement: true });
            });
        }

        static closeConnection(){
            if(connection){
                closeOriginal();
                connection = null;
        
            }
        }
    }
})();