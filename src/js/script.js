const tagUl           = document.querySelector("ul")
const tagButton       = document.querySelector("#botoesContainer")
const tagDiv          = document.querySelector(".containerBuscaPorNome")
const tagSection      = document.querySelector(".priceContainer span")
const tagSectionCart  = document.querySelector(".productCart")

function criarCards(element){
    const tagLi       = document.createElement('li')
    const tagImg      = document.createElement('img')
    const tagH3       = document.createElement('h3')
    const tagSpan     = document.createElement('span')
    const tagP        = document.createElement('p')
    const tagB        = document.createElement('button')
    const tagOl       = document.createElement('ol')

    tagImg.src         = element.img
    tagH3.innerText    = element.nome
    tagSpan.innerText  = element.secao

    tagP.innerText     = `R$ ${Number(element.preco).toFixed(2)}`
    tagB.innerText     = "Comprar"
    tagB.setAttribute  ('id', element.id)
    
    for(i in element.componentes){
        const tagLiOl      = document.createElement('li')
        tagLiOl.innerText  = element.componentes[i]
        
        tagOl.append(tagLiOl)
    }
    
    tagUl.append    (tagLi)
    tagP.append     (tagB)
    tagLi.append    (tagImg, tagH3, tagSpan, tagOl, tagP)
}

function renderCards(array){
    array.forEach(criarCards)
    tagSection.innerText = `R$ ${atualizaValor(array)}`
}
renderCards(produtos)


tagButton.addEventListener('click', function(event){
    tagUl.innerHTML = ""
    if(event.target.tagName == "BUTTON" ){
        if(event.target.innerText == "Todos Produtos"){
            renderCards(produtos)
    }
    else{
        renderCards(produtos.filter(filtrandoBotoes))
    }

    function filtrandoBotoes(element){
        if(element.secao == event.target.innerText){
            return element
        }
    }
}})

tagDiv.addEventListener('click', function(event){
    let busca = document.querySelector(".containerBuscaPorNome input").value.toLowerCase().trim()

    if(event.target.tagName == "BUTTON" || event.target.tagName == "IMG"){
        tagUl.innerHTML = ""
        
        renderCards(produtos.filter(filtrarProdutos))
        
        function filtrarProdutos(element){
            // NFD = Separa os acentos das letras
            // /G = Global
            // \u0300-\u036f = caracteres especiais para referenciar os acentos
            if(
                element.secao.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')      == busca||
                element.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')       == busca|| 
                element.categoria.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')  == busca){
                return element
            }
        }
    }
})


function atualizaValor(array){
    let todoValor = 0

    array.forEach(valor => {
        todoValor += Number(valor.preco)
    })

    return todoValor.toFixed(2)
}

let arrayCarrinho = []

tagUl.addEventListener('click', internalEventos)

function internalEventos(event) {
    let myClick   = event.target
    if (myClick.tagName == "BUTTON") {
        let produtoCarrinho = produtos[myClick.id]
        arrayCarrinho.push({
            ...produtoCarrinho,
            unicId: Date.now()
        })
        renderCarrinho(arrayCarrinho)
    }
}

function renderCarrinho(){
    tagSectionCart.innerHTML = ""

    for( let i in arrayCarrinho){
        let tagUlCarrinho      = document.createElement('ul')
        let tagImg             = document.createElement('img')
        let tagDivTitle        = document.createElement('div')
        let tagH3              = document.createElement('h3')
        let tagP               = document.createElement('p')
        let tagSpan            = document.createElement('span')
        let tagButton          = document.createElement('button')
        let tagI               = document.createElement('i')

        tagUlCarrinho.classList.add   ('produtosDoCarrinho')
        tagI.classList.add            ('uil') 
        tagI.classList.add            ('uil-trash-alt')

        tagUlCarrinho.id       = arrayCarrinho[i].unicId
        tagImg.src             = arrayCarrinho[i].img
        tagH3.innerText        = arrayCarrinho[i].nome
        tagP.innerText         = arrayCarrinho[i].secao
        tagSpan.innerText      = `R$ ${Number(arrayCarrinho[i].preco).toFixed(2)}`


        tagUlCarrinho.append            (tagImg, tagDivTitle)
        tagButton.append                (tagI)
        tagDivTitle.append              (tagH3, tagP, tagSpan)
        tagUlCarrinho.append            (tagButton)
        
        tagSectionCart.appendChild      (tagUlCarrinho)
    }
    somarValorCarrinho(arrayCarrinho)
}

function limparCarrinho(){
    if(arrayCarrinho.length === 0){
        tagSectionCart.innerHTML = `
        <i class="uil uil-shopping-bag"></i>
        <h5>Por enquanto não temos produtos no carrinho</h5>
        `
    }
}

tagSectionCart.addEventListener('click', removeCarrinho)

function removeCarrinho(event){
    if(event.target.tagName == 'BUTTON' || event.target.tagName == 'I' ){
        let lugarId = event.target.closest('ul').id
        arrayCarrinho = arrayCarrinho.filter((valor) => {
            return valor.unicId != lugarId
        })
    }
    somarValorCarrinho (arrayCarrinho)
    renderCarrinho     ()
    limparCarrinho     ()
}

let tagH3Vendas  =  document.querySelector  ('#quantidade')
let tagH3Total   =  document.querySelector  ('#total')

function somarValorCarrinho(arr){
    let total = 0
    for(let i in arr){
        total = total + Number(arr[i].preco)
    }
    tagH3Total.innerText    = `R$ ${total.toFixed(2)}`
    tagH3Vendas.innerText   = arrayCarrinho.length
}

// arr.reduce((acc, a) => acc + Number(a.preco), 0 )
// arr.reduce((acc, a) => {
//    return acc + Number(a.preco)}, 0 )