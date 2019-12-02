class ItemView {

    constructor(itens) {
        this.compras = [];
        this.controller = new ItemController(itens);
        this.renderizarCardsCompras(this.compras);
        this.renderizarTabelaCompras(this.compras);
    }

    salvarCompra(event) {
        // Inibe a recarga da página
        event.preventDefault();

        /**
         * $ -> document.querySelector
         * val() -> value
         */
        // Recupera os valores do formulário
        let itemSelecionado = $('#item').val();
        let quantidade = $('#quantidade').val();

        // Cria um objeto de item
        let item = this.controller.buscarItem(itemSelecionado); //new Item(itemSelecionado, quantidade);

        // Cria um objeto de compra
        let compra = new Compra(item, quantidade);

        if (this.controller.buscarCompra(item.id)) {
            this.controller.alterarQuantidade(item.id, quantidade);
        } else {
            // Adiciona o item no nosso BD (no final do vetor)
            this.controller.salvar(compra);
        }

        this.limparFormulario();

        // Limpa o step do input number
        if (compra.item.unidadeDeMedida == 'kg') {
            let inputNumber = document.getElementById('quantidade');
            inputNumber.removeAttribute('step');
        }

        let compras = this.controller.recuperarTodas();

        // Limpa o filtro
        document.getElementById('filtro').value = '';

        // Invoca a renderização da tabela
        this.renderizarTabelaCompras(compras);

        // Invoca a renderização dos cards
        this.renderizarCardsCompras(compras);
    }

    removerCompra(event, id) {
        // Inibe a recarga da página
        event.preventDefault();

        let compra = this.controller.buscarCompra(id);

        this.controller.removerCompra(compra);

        let compras = this.controller.recuperarTodas();

        // Invoca a renderização da tabela
        this.renderizarTabelaCompras(compras);

        // Invoca a renderização dos cards
        this.renderizarCardsCompras(compras);
    }

    /**
     * Limpa o formulário de cadastro de item
     */
    limparFormulario() {
        [
            'item',
            'quantidade'
        ].forEach(id => document.getElementById(id).value = '');

        document.getElementById('unidadeDeMedida').innerText = '';
    }

    renderizarTabelaCompras(compras) {
        let areaListagemCompras = document.getElementById('tabelaCompras');

        /**
         * Limpa a área de listagem
         */
        areaListagemCompras.innerHTML = '';

        if (compras.length > 0) {
            /**
             * Cria a tabela
             */
            let tabela = document.createElement('table');

            //let cabecalho = this.criarCabecalhoTabela();
            // Adiciona o cabeçalho dentro da tabela
            //tabela.appendChild(cabecalho);

            let corpoTabela = this.criarCorpoTabela(compras);
            // Adiciona o corpo da tabela na tabela
            tabela.appendChild(corpoTabela);

            // Adiciona a tabela na área de listagem
            areaListagemCompras.appendChild(tabela);
        } else {
            if (this.controller.carrinhoVazio()) {
                let spanMensagem = document.createElement('span');
                spanMensagem.innerText = 'Comece logo sua lista de compras, antes que esqueça de algo!';
                areaListagemCompras.appendChild(spanMensagem);
            } else {
                let spanMensagem = document.createElement('span');
                spanMensagem.innerText = 'Ops! Não consegui achar nenhum item parecido com essa descrição em sua lista de compras.';
                areaListagemCompras.appendChild(spanMensagem);
            }
        }
    }

    criarCabecalhoTabela() {
        /**
         * Cria o cabeçalho da tabela
         */
        let cabecalho = document.createElement('thead');
        let linhaCabecalho = document.createElement('tr');
        let colunaCheck = document.createElement('th');
        colunaCheck.innerText = 'Confirmar';
        let colunaItem = document.createElement('th');
        colunaItem.innerText = 'Item';
        let colunaExcluir = document.createElement('th');
        colunaExcluir.innerText = 'Excluir';

        // Adiciona as colunas na linha do cabeçalho
        linhaCabecalho.appendChild(colunaCheck);
        linhaCabecalho.appendChild(colunaItem);
        linhaCabecalho.appendChild(colunaExcluir);

        // Adiciona a linha do cabeçalho no cabeçalho
        cabecalho.appendChild(linhaCabecalho);

        // Retorna o cabeçalho criado
        return cabecalho;
    }

    criarCorpoTabela(compras) {
        /**
         * Cria o corpo da tabela
         */
        let corpoTabela = document.createElement('tbody');

        /**
         * Cria a linhas de compras
         */
        for (let i = 0; i < compras.length; i++) {
            /**
             * Cria uma nova linha no corpo da tabela
             */
            let linha = document.createElement('tr');

            let celulaCheck = document.createElement('td');
            if (compras[i].check == false) {
                celulaCheck.innerHTML = '<a href="" id="' + compras[i].item.id + '" onclick="itemView.checar(event, \'' + compras[i].item.id + '\')"><img title="Clique para confirmar que este item já foi adicionado ao carrinho de compras" src="src/img/check.png" alt="Carrinho de compra com a opção de Checar o item"></a>';
            } else {
                celulaCheck.innerHTML = '<a id="' + compras[i].item.id + '\')"><img title="Item já adicionado ao carrinho de compras" src="src/img/checked.png" alt="Carrinho de compra com um simbolo de checado"></a>';
            }

            linha.appendChild(celulaCheck);
            let celulaCompra = document.createElement('td');
            celulaCompra.innerText = compras[i].quantidade + ' ' + compras[i].item.unidadeDeMedida +
                ' de ' + compras[i].item.descricao;
            linha.appendChild(celulaCompra);
            let celulaExcluir = document.createElement('td');
            celulaExcluir.innerHTML = '<a href="" id="' + compras[i].item.id + '" onclick="itemView.removerCompra(event, \'' + compras[i].item.id + '\')"><img title="Clique para remover este item do carrinho de compras" src="src/img/remover.png" alt="Carrinho de compra com simbolo que remete à remoção deste item">';
            linha.appendChild(celulaExcluir);

            // Adiciona a nova linha no corpo da tabela
            corpoTabela.appendChild(linha);
        }

        return corpoTabela;
    }

    renderizarCardsCompras(compras) {
        let areaListagemCompras = document.getElementById('cardsCompras');

        /**
         * Limpa a área de listagem
         */
        areaListagemCompras.innerHTML = '';

        if (compras.length > 0) {
            /**
             * Ao invés de usar um loop,
             * utilizaremos a função forEach
             */
            compras.forEach(function (compra) {
                let card = document.createElement('div');
                let inicialDescricao = document.createElement('span');
                inicialDescricao.innerText = compra.item.descricao.charAt(0);
                let descricao = document.createElement('span');
                let tamanhoDescricao = compra.item.descricao.length;
                descricao.innerText = compra.item.descricao.substr(1, tamanhoDescricao);

                card.appendChild(inicialDescricao);
                card.appendChild(descricao);
                areaListagemCompras.appendChild(card);
            });
        } else {
            if (this.controller.carrinhoVazio()) {
                let spanMensagem = document.createElement('span');
                spanMensagem.innerText = 'Comece logo sua lista de compras, antes que esqueça de algo!';
                areaListagemCompras.appendChild(spanMensagem);
            } else {
                let spanMensagem = document.createElement('span');
                spanMensagem.innerText = 'Nenhum item encontrado';
                areaListagemCompras.appendChild(spanMensagem);
            }
        }
    }

    filtrarCompras() {

        let filtro = document.getElementById('filtro').value;
        filtro = filtro.toLowerCase();
        console.log(filtro);

        /**
         * Filtra as Compras de acordo
         * com o texto digitado pelo 
         * usuário no campo de filtro
         */
        let compras = this.controller.filtrar(filtro);

        this.renderizarCardsCompras(compras);
        this.renderizarTabelaCompras(compras);

    }

    carregarUnidadeDeMedida(event) {
        // Inibe a recarga da página
        event.preventDefault();

        // Recupera os valores do formulário
        let itemSelecionado = $('#item').val();

        //console.log(itemSelecionado);

        let divUnidadeDeMedida = document.getElementById('unidadeDeMedida');
        let unidadeDeMedida = this.controller.buscarUnidadeDeMedida(itemSelecionado);
        divUnidadeDeMedida.innerText = unidadeDeMedida

        if (unidadeDeMedida == 'kg') {
            let inputNumber = document.getElementById('quantidade');
            inputNumber.setAttribute('step', '0.01');
        }
    }

    checar(event, id) {
        event.preventDefault();

        this.controller.checarCompra(id);

        let compras = this.controller.recuperarTodas();
        this.renderizarCardsCompras(compras);
        this.renderizarTabelaCompras(compras);
    }
}