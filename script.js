
"use strict";

class Produto {
    constructor(nome, preco, quantidade) {
        this.nome = nome;
        this.preco = parseFloat(preco);
        this.quantidade = parseInt(quantidade, 10);
    }

    calcularSubtotal() {
        return this.preco * this.quantidade;
    }
}

const listaDeProdutos = [];
const CHAVE_STORAGE = "sistema_estoque_produtos";

const formProduto = document.getElementById("form-produto");
const nomeInput = document.getElementById("nome");
const precoInput = document.getElementById("preco");
const quantidadeInput = document.getElementById("quantidade");
const btnSalvar = document.getElementById("btn-salvar");
const btnLimparTudo = document.getElementById("limpar-tabela");
const totalEstoqueEl = document.getElementById("total-estoque");
const tabelaBody = document.getElementById("tabela-produtos");

let indiceEdicao = null;

function salvarNoLocalStorage() {
    localStorage.setItem(
        CHAVE_STORAGE,
        JSON.stringify(listaDeProdutos)
    );
}

function carregarDoLocalStorage() {
    const dadosSalvos = localStorage.getItem(CHAVE_STORAGE);

    if (!dadosSalvos) {
        return;
    }

    try {
        const produtosObjetos = JSON.parse(dadosSalvos);

        if (!Array.isArray(produtosObjetos)) {
            return;
        }

        produtosObjetos.forEach((prod) => {
            const nome = String(prod.nome ?? "").trim();
            const preco = Number(prod.preco);
            const quantidade = Number(prod.quantidade);

            if (
                nome &&
                Number.isFinite(preco) &&
                preco > 0 &&
                Number.isInteger(quantidade) &&
                quantidade > 0
            ) {
                listaDeProdutos.push(
                    new Produto(nome, preco, quantidade)
                );
            }
        });
    } catch {
        listaDeProdutos.length = 0;
    }
}

function prepararEdicao(index) {
    const produto = listaDeProdutos[index];

    if (!produto) {
        return;
    }

    nomeInput.value = produto.nome;
    precoInput.value = produto.preco;
    quantidadeInput.value = produto.quantidade;

    indiceEdicao = index;
    btnSalvar.textContent = "Salvar Alterações";

    nomeInput.focus();
}

formProduto.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = nomeInput.value.trim();
    const precoTexto = precoInput.value.trim();
    const quantidadeTexto = quantidadeInput.value.trim();

    const preco = Number(precoTexto);
    const quantidade = Number(quantidadeTexto);

    if (!nome) {
        alert("Por favor, informe um nome válido para o produto.");
        nomeInput.focus();
        return;
    }

    if (
        precoTexto === "" ||
        isNaN(precoInput.valueAsNumber) ||
        !Number.isFinite(preco) ||
        preco <= 0
    ) {
        alert("Digite um preço numérico válido maior que zero.");
        precoInput.focus();
        return;
    }

    if (
        quantidadeTexto === "" ||
        isNaN(quantidadeInput.valueAsNumber) ||
        !Number.isInteger(quantidade) ||
        quantidade <= 0
    ) {
        alert("Digite uma quantidade inteira maior que zero.");
        quantidadeInput.focus();
        return;
    }

    const novoProduto = new Produto(nome, preco, quantidade);

    if (indiceEdicao === null) {
        listaDeProdutos.push(novoProduto);
    } else {
        listaDeProdutos[indiceEdicao] = novoProduto;
    }

    salvarNoLocalStorage();
    atualizarInterface();
    formProduto.reset();

    indiceEdicao = null;
    btnSalvar.textContent = "Adicionar Produto";
    nomeInput.focus();
});

function removerProduto(index) {
    if (index < 0 || index >= listaDeProdutos.length) {
        return;
    }

    if (!confirm("Deseja realmente remover este produto?")) {
        return;
    }

    listaDeProdutos.splice(index, 1);

    if (indiceEdicao === index) {
        formProduto.reset();
        indiceEdicao = null;
        btnSalvar.textContent = "Adicionar Produto";
    } else if (indiceEdicao !== null && indiceEdicao > index) {
        indiceEdicao--;
    }

    salvarNoLocalStorage();
    atualizarInterface();
}

btnLimparTudo.addEventListener("click", function () {
    if (listaDeProdutos.length === 0) {
        alert("A tabela já está vazia!");
        return;
    }

    if (confirm("Tem certeza que deseja remover todos os produtos?")) {
        listaDeProdutos.length = 0;
        localStorage.removeItem(CHAVE_STORAGE);

        formProduto.reset();
        indiceEdicao = null;
        btnSalvar.textContent = "Adicionar Produto";

        atualizarInterface();
    }
});

function atualizarTotalEstoque() {
    const total = listaDeProdutos.reduce((acc, produto) => {
        return acc + produto.calcularSubtotal();
    }, 0);

    totalEstoqueEl.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function renderizarTabela() {
    tabelaBody.innerHTML = "";

    if (listaDeProdutos.length === 0) {
        const linha = document.createElement("tr");
        const celula = document.createElement("td");

        celula.colSpan = 5;
        celula.textContent = "Nenhum produto cadastrado.";

        linha.appendChild(celula);
        tabelaBody.appendChild(linha);

        return;
    }

    listaDeProdutos.forEach((produto, index) => {
        const linha = document.createElement("tr");

        const celulaNome = document.createElement("td");
        const celulaPreco = document.createElement("td");
        const celulaQuantidade = document.createElement("td");
        const celulaSubtotal = document.createElement("td");
        const celulaAcoes = document.createElement("td");

        celulaNome.textContent = produto.nome;

        celulaPreco.textContent = produto.preco.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        celulaQuantidade.textContent = produto.quantidade;

        celulaSubtotal.textContent = produto.calcularSubtotal().toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        const btnEditar = document.createElement("button");
        btnEditar.type = "button";
        btnEditar.textContent = "Editar";
        btnEditar.className = "editar";

        btnEditar.addEventListener("click", function () {
            prepararEdicao(index);
        });

        const btnRemover = document.createElement("button");
        btnRemover.type = "button";
        btnRemover.textContent = "Remover";
        btnRemover.className = "remover";

        btnRemover.addEventListener("click", function () {
            removerProduto(index);
        });

        celulaAcoes.append(btnEditar, btnRemover);

        linha.append(
            celulaNome,
            celulaPreco,
            celulaQuantidade,
            celulaSubtotal,
            celulaAcoes
        );

        tabelaBody.appendChild(linha);
    });
}

function atualizarInterface() {
    renderizarTabela();
    atualizarTotalEstoque();
}

carregarDoLocalStorage();
atualizarInterface();
    
