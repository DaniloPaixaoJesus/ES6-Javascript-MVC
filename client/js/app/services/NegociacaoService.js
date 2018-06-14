class NegociacaoService {
    
    constructor() {
        
        this._http = new HttpService();
    }

    importa(listaAtual) {

        return this.obterNegociacoes()
            .then(negociacoes =>
                negociacoes.filter(negociacao =>
                    !listaAtual.some(negociacaoExistente =>
                        JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente)))
            )
            .catch(erro => {
                console.log(erro);
                throw new Error("Não foi possível importar as negociações");
            });
    }

    cadastra(negociacao) {
        return ConnectionFactory
           .getConnection()
           .then(connection => new NegociacaoDao(connection))
           .then(dao => dao.adiciona(negociacao))
           .then(() => 'Negociação cadastrada com sucesso')
           .catch(erro => {
              console.log(erro);
              throw new Error('Não foi possível adicionar a negociação')
           });
   }

    lista() {
        return ConnectionFactory
        .getConnection()
        .then(connection => new NegociacaoDao(connection))
        .then(dao => dao.listaTodos())
        .catch(erro => {
            console.log(erro);
            throw new Error('Não foi possível obter as negociações')
        })
    }

    apaga() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(() => 'Negociações apagadas com sucesso')
            .catch(erro => {
                  console.log(erro);
                  throw new Error('Não foi possível apagar as negociações')
            });
    }
    
    
    obterNegociacoesDaSemana() {
               
        return this._http
            .get('negociacoes/semana')
            .then(resolve => {
                console.log(resolve);
                return resolve.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
            })
            .catch(reject => {
                console.log(reject);
                throw new Error('Não foi possível obter as negociações da semana');
            });  
    }
    
    obterNegociacoesDaSemanaAnterior() {
               
        return this._http
            .get('negociacoes/anterior')
            .then(resolve => {
                console.log(resolve);
                return resolve.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
            })
            .catch(reject => {
                console.log(reject);
                throw new Error('Não foi possível obter as negociações da semana anterior');
            });   
    }
    
    obterNegociacoesDaSemanaRetrasada() {
               
        return this._http
            .get('negociacoes/retrasada')
            .then(resolve => {
                console.log(resolve);
                return resolve.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
            })
            .catch(reject => {
                console.log(reject);
                throw new Error('Não foi possível obter as negociações da semana retrasada');
            });  
        
    }
    
    obterNegociacoes() {
        //uso do Promise para evitar chamada CallBack Hell
        //chamadas aninhadas e ilegíveis
        return Promise.all([ //executa vários promisses sequencialmente
            this.obterNegociacoesDaSemana(),
            this.obterNegociacoesDaSemanaAnterior(),
            this.obterNegociacoesDaSemanaRetrasada()
        ]).then(resolve => { //pega do resolve

            let negociacoes = resolve
                .reduce((dados, resolve) => dados.concat(resolve), []) //concatena todos os arrays do promise.all
                .map(dado => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor ));

            return negociacoes;
        }).catch(reject => { //pega do reject
            throw new Error(reject);
        });
    } 
    
    exemploChamada(){
        //captura valor, por exemplo
        //faz alguma coisa
        let chamadaService;
        let FazAlgumaCoisa;
        return executaProcedimentos((erro, arg1, arg2)=>{
                if(erro){
                    return `erro no processamento: $erro`;
                }
                let resultado = arg1 + arg2;
                return resultado;
            }            
        );    
    }

    executaProcedimentos(callBack) {
        //consulta informacao na rede, por exemplo
        //processa alguma coisa

        let param1 = "valor param 1";
        let param2 = "valor param 2";
        if(param1){
            return callBack('erro na chamada ajax', param1, param2)
        }
        return callBack(null, param1, param2)
    }
}
