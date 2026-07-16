const receitas = {

R001:[
["Bacalhau",450,"g"],
["Batata",400,"g"],
["Azeite",2,"c. sopa"],
["Alho",2,"dentes"],
["Ovos",2,"unid."]
],

R002:[
["Frango",500,"g"],
["Arroz",250,"g"]
]

};

function procurar(){

let id=document.getElementById("receita").value;

let tabela=document.querySelector("#resultado tbody");

tabela.innerHTML="";

if(receitas[id]){

receitas[id].forEach(item=>{

tabela.innerHTML+=`
<tr>
<td>${item[0]}</td>
<td>${item[1]}</td>
<td>${item[2]}</td>
</tr>`;

});

}else{

tabela.innerHTML="<tr><td colspan='3'>Receita não encontrada.</td></tr>";

}

}
