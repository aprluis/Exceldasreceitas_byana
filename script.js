// =============================================
// Excel das Receitas By Ana
// script.js
// =============================================

const SHEET_ID = "1wIUdHQPey7cv5cAEHotRBNIFTy3dN5Zcu2GUJaI8W9s";

const URL_RECEITA =
`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent("Ingredientes por Receita")}`;

const URL_INGREDIENTES =
`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent("Ingredientes")}`;


//-------------------------------

async function obterFolha(url){

    const resposta = await fetch(url);

    const texto = await resposta.text();

    const json = JSON.parse(texto.substring(47).slice(0,-2));

    return json.table.rows;

}

//-------------------------------

function valor(c){

    if(!c) return "";

    if(c.f) return c.f;

    return c.v ?? "";

}

//-------------------------------

async function procurarReceita(){

    const codigo = document
        .getElementById("codigo")
        .value
        .trim()
        .toUpperCase();

    if(codigo=="") return;

    const receitas = await obterFolha(URL_RECEITA);

    const ingredientes = await obterFolha(URL_INGREDIENTES);

    let mapa = {};

    ingredientes.forEach(linha=>{

        if(!linha.c) return;

        const id = valor(linha.c[1]);

        mapa[id]={

            nome:valor(linha.c[0]),

            secao:valor(linha.c[2])

        };

    });

    const tbody=document.getElementById("resultado");

    tbody.innerHTML="";

    let encontrou=false;

    receitas.forEach(linha=>{

        if(!linha.c) return;

        if(valor(linha.c[0])!=codigo) return;

        encontrou=true;

        const idIngrediente=valor(linha.c[1]);

        const info=mapa[idIngrediente] || {};

        tbody.innerHTML+=`

        <tr>

        <td>${idIngrediente}</td>

        <td>${info.nome || valor(linha.c[2])}</td>

        <td>${valor(linha.c[3])}</td>

        <td>${valor(linha.c[4])}</td>

        <td>${info.secao || ""}</td>

        </tr>

        `;

    });

    if(!encontrou){

        tbody.innerHTML=

        `<tr>

        <td colspan="5">

        Receita não encontrada.

        </td>

        </tr>`;

    }

}

//-------------------------------

document.addEventListener("DOMContentLoaded",()=>{

    const botao=document.getElementById("btnPesquisar");

    if(botao){

        botao.addEventListener("click",procurarReceita);

    }

});
