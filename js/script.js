//https://wllsistemas.com.br/api/cliente/

//Tooltip do bootstrap para a info inicial
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

var erroTipo = document.getElementById("erroTipo")

const URL_BASE = "https://wllsistemas.com.br/api/v3/cliente/"

// Quando carrega a página
window.addEventListener("load", () => {
  // Carrega as tabelas
  carregaDados();

  // Validação ao tirar o foco do input
  nome.addEventListener('blur', () => {
    if (nome.value == '') {
      erroNome.innerHTML = '<i class="fas fa-info-circle 2x"></i> Preencha o nome'
      erroNome.style.color = 'red'
    } else {
      erroNome.innerHTML = '<i class="fas fa-info-circle 2x"></i>'
      erroNome.style.color = 'green'
    }
  })

  // Validação ao tirar o foco do input
  email.addEventListener('blur', () => {
    if ((email.value == "") || (email.value.indexOf("@") == -1)) {
      erroEmail.innerHTML = '<i class="fas fa-info-circle 2x"></i> Preencha o e-mail com @'
      erroEmail.style.color = 'red'
    } else {
      erroEmail.innerHTML = '<i class="fas fa-info-circle 2x"></i>'
      erroEmail.style.color = 'green'
    }
  })

  // Validação ao tirar o foco do input
  tipo.addEventListener('change', () => {
    if (tipo.value == 0) {
      erroTipo.innerHTML = '<i class="fas fa-info-circle 2x"></i> Preencha o tipo'
      erroTipo.style.color = 'red'
      console.log(erroTipo.innerHTML)
    } else {
      erroTipo.innerHTML = '<i class="fas fa-info-circle 2x"></i>'
      erroTipo.style.color = 'green'
    }
  })

})


// Botão Carregar
carregar.addEventListener('click', (event) => {
  event.preventDefault()
  fetch(URL_BASE)
    .then(response => response.json())
    .then(json => {
      display.innerHTML = apresentaDados(json);
      //console.log(apresentaDados(json))

    })
})

// Botão Limpar
limpar.addEventListener('click', (event) => {
  event.preventDefault()
  limparDadosEntrada()
  formEstadoInicial()

})

// Botão Gravar
gravar.addEventListener('click', (event, valildaCampo) => {
  event.preventDefault()
  if (nome.value == '') {
    erroNome.innerHTML = '<i class="fas fa-info-circle 2x"></i> Preencha o nome'
    erroNome.style.color = 'red'
  }

  if (email.value == '') {
    erroEmail.innerHTML = '<i class="fas fa-info-circle 2x"></i> Preencha o e-mail'
    erroEmail.style.color = 'red'
  }
  if (tipo.value == 0) {
    erroTipo.innerHTML = '<i class="fas fa-info-circle 2x"></i> Preencha o tipo'
    erroTipo.style.color = 'red'
    console.log(erroTipo.innerHTML)
  }

  (id.value == '') ? cadastrar(): editar();
  limparDadosEntrada()

})


// Funções 
function limparDadosEntrada() {
  id.value = '';
  nome.value = '';
  email.value = '';

  tipo.innerHTML = `
                <option value="0" disabled selected>*Selecione o Tipo*</option>
                <option value="JURIDICA">Jurídica</option>
                <option value="FISICA">Física</option>
`
}

function carregaDados() {
  fetch(URL_BASE, {
      cache: 'no-store'
    })
    .then(response => response.json())
    .then(json => {
      display.innerHTML = apresentaDados(json)

      json.forEach(acaoBotao => {
        var btnEditar = document.getElementById('editar_' + acaoBotao.ID)
        btnEditar.addEventListener('click', () => {
          nome.value = acaoBotao.NOME
          id.value = acaoBotao.ID
          email.value = acaoBotao.EMAIL
          tipo.value = acaoBotao.TIPO
        })

        var btnDeletar = document.getElementById('deletar_' + acaoBotao.ID)
        btnDeletar.addEventListener('click', () => {
          let confirmar = confirm("Deseja deletar o item " + acaoBotao.ID)
          if (confirmar == true) {
            deletar(acaoBotao)
            console.log(confirmar)
          }

        })
      })
    })

}

function apresentaDados(json) {
  let tabela = "";
  json.forEach(element => {
    tabela += `<tr  id="cadastro_${element.ID}">
    <td class="text-center">${element.ID}</td>
    <td class="text-center">${element.NOME}</td>
    <td class="text-center">${element.EMAIL}</td>
    <td class="text-center">${element.TIPO}</td>
    <td class="text-center" id="botaoAcao">
      <button class="btn btn-primary darken-1 edita" id="editar_${element.ID}"><span class="valign-wrapper">Editar <i class="fas fa-edit"></i></span></button>
      <button class="btn btn-danger" id="deletar_${element.ID}"><span class="valign-wrapper deleta">Deletar <i class="fas fa-trash-alt"></i></span></button>
    </td>
    </tr>`
  })





  //deletarCadastro();

  return tabela;
}

function cadastrar() {
  fetch(URL_BASE, {
      method: 'POST',
      body: 'nome=' + nome.value + '&email=' + email.value + '&tipo=' + tipo.value,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.json == 201) {
        carregaDados()
      }
      return response.json()
    })
    .then(json => {
      alert(json.mensagem)
      carregaDados()
      limparDadosEntrada()
      formEstadoInicial()
    })
}

function editar() {
  fetch(URL_BASE, {
      method: 'PUT',
      body: 'id=' + id.value + '&nome=' + nome.value + '&email=' + email.value + '&tipo=' + tipo.value,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.json == 202) {
        carregaDados()
      }
      return response.json()
    })
    .then(json => {
      alert(json.mensagem)
      carregaDados()
      formEstadoInicial();
    })
}

function deletar(acaoBotao) {
  fetch(URL_BASE + acaoBotao.ID, {
      method: 'DELETE'
    })
    .then(response =>
      response.json())
    .then(json => {
      carregaDados()
    })


}

function formEstadoInicial() {
  erroNome.innerHTML = '<i class="fas fa-info-circle 2x"></i>'
  erroNome.style.color = 'inherit'
  erroEmail.innerHTML = '<i class="fas fa-info-circle 2x"></i>'
  erroEmail.style.color = 'inherit'
  erroTipo.innerHTML = '<i class="fas fa-info-circle 2x"></i>'
  erroTipo.style.color = 'inherit'
}