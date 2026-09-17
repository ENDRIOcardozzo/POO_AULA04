class Produto {

    #preco;
    #quantidade;
    
    constructor(nome, preco, quantidade) {
    
        if (nome.trim() === "") {
            throw new Error("O nome do produto não pode estar em branco!");
        }
    
        if (preco <= 0) {
            throw new Error("O preço deve ser maior que zero!");
        }
    
        if (quantidade <= 0) {
            throw new Error("A quantidade deve ser maior que zero!");
        }
    
        this.nome = nome;
        this.#preco = preco;
        this.#quantidade = quantidade;
    }
    
    get preco() {
        return this.#preco;
    }
    
    set preco(novoPreco) {
    
        if (novoPreco <= 0) {
            throw new Error("O preço deve ser maior que zero!");
        }
    
        this.#preco = novoPreco;
    }
    
    get quantidade() {
        return this.#quantidade;
    }
    
    set quantidade(novaQuantidade) {
    
        if (novaQuantidade <= 0) {
            throw new Error("A quantidade deve ser maior que zero!");
        }
    
        this.#quantidade = novaQuantidade;
    }
    
    get subtotal() {
        return this.#preco * this.#quantidade;
    }
    
    
    }
    
    let produtos = [];
    
    function cadastrarProduto() {
    
    try {
    
        const nome = document.getElementById("nome").value;
        const preco = Number(document.getElementById("preco").value);
        const quantidade = Number(document.getElementById("quantidade").value);
    
        const produto = new Produto(nome, preco, quantidade);
    
        produtos.push(produto);
    
        atualizarTabela();
    
        document.getElementById("nome").value = "";
        document.getElementById("preco").value = "";
        document.getElementById("quantidade").value = "";
    
        document.getElementById("nome").focus();
    
    } catch (erro) {
    
        alert(erro.message);
    
    }
    
    
    }
    
    function atualizarTabela() {
    
    const tabela = document.getElementById("tabelaProdutos");
    
    tabela.innerHTML = "";
    
    if (produtos.length === 0) {
    
        tabela.innerHTML = `
            <tr>
                <td colspan="5" class="vazio">
                    Nenhum produto cadastrado.
                </td>
            </tr>
        `;
    
        atualizarTotal();
    
        return;
    }
    
    produtos.forEach((produto, indice) => {
    
        const linha = document.createElement("tr");
    
        linha.innerHTML = `
            <td>${produto.nome}</td>
    
            <td>
                R$ ${produto.preco.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}
            </td>
    
            <td>${produto.quantidade}</td>
    
            <td>
                R$ ${produto.subtotal.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}
            </td>
    
            <td>
                <button
                    class="btn-remover"
                    onclick="removerProduto(${indice})"
                >
                    Remover
                </button>
            </td>
        `;
    
        tabela.appendChild(linha);
    });
    
    atualizarTotal();
    
    
    }
    
    function atualizarTotal() {
    
    let total = 0;
    
    produtos.forEach(produto => {
        total += produto.subtotal;
    });
    
    document.getElementById("total").textContent =
        total.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    
    
    }
    
    function removerProduto(indice) {
    
    produtos.splice(indice, 1);
    
    atualizarTabela();
    
    
    }
    
    function limparProdutos() {
    
    if (produtos.length === 0) {
        return;
    }
    
    const confirmar = confirm(
        "Deseja realmente limpar todos os produtos?"
    );
    
    if (confirmar) {
    
        produtos = [];
    
        atualizarTabela();
    }
    
    
    }