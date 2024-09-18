// Inicializar
document.getElementById('iniciar').addEventListener('click', function () {
    const nome = document.getElementById('nome').value;
    if (nome) {
        localStorage.setItem('nome', nome);  // Armazenar nome para referência
        document.getElementById('form-nome').classList.add('hidden');
        document.getElementById('tela-presentes').classList.remove('hidden');
    } else {
        alert('Por favor, insira seu nome completo!');
    }
});

// Armazenar presentes selecionados
let presentesSelecionados = [];

document.querySelectorAll('.escolher').forEach(button => {
    button.addEventListener('click', function () {
        const presente = this.getAttribute('data-presente');
        presentesSelecionados.push(presente);
        alert(`${presente} foi adicionado à sua lista!`);
    });
});

// Enviar dados para Google Sheets
document.getElementById('enviar').addEventListener('click', function () {
    const nome = localStorage.getItem('nome');
    const data = new Date().toLocaleString();
    
    if (presentesSelecionados.length === 0) {
        alert('Por favor, selecione ao menos um presente.');
        return;
    }

    const sheetData = {
        nome: nome,
        data: data,
        presentes: presentesSelecionados.join(', ')
    };

    fetch('https://sheetdb.io/api/v1/lilmqffgjyxmh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Lista enviada com sucesso! Obrigado por participar do nosso Chá de Panela!');
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Houve um erro ao enviar sua lista.');
    });
});

// Inicializar
document.getElementById('iniciar').addEventListener('click', function () {
    const nome = document.getElementById('nome').value;
    if (nome) {
        localStorage.setItem('nome', nome);  // Armazenar nome para referência
        
        // Esconder a tela de inserção de nome
        document.getElementById('form-nome').style.display = 'none';
        
        // Mostrar a tela de presentes
        document.getElementById('tela-presentes').style.display = 'block';
    } else {
        alert('Por favor, insira seu nome completo!');
    }
});

// Função que captura os presentes selecionados e o nome da pessoa
async function enviarDadosParaSheets() {
    // Captura o nome da pessoa (ajuste o ID do campo conforme necessário)
    const nomePessoa = document.getElementById("nomeUsuario").value;

    // Captura os presentes selecionados (ajuste conforme necessário)
    const presentesSelecionados = [
        "Descrição do presente 1",
        "Descrição do presente 2",
        "Descrição do presente 3"
    ].join(", "); // Concatena os presentes em uma string separada por vírgula

    const dataAtual = new Date().toLocaleDateString(); // Pega a data atual

    // Cria o objeto com os dados formatados
    const dados = {
        "Nome": nomePessoa,
        "Data": dataAtual,
        "Presentes Selecionados": presentesSelecionados
    };

    const url = "https://sheetdb.io/api/v1/lilmqffgjyxmh"; // Substitua com a URL da Web App

    try {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados) // Envia os dados como JSON
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const resultado = await response.json();
        console.log("Success:", resultado);
        alert("Lista de presentes enviada com sucesso!");

    } catch (error) {
        console.error("Erro ao enviar dados:", error);
        alert(`Erro ao enviar lista de presentes: ${error.message}`);
    }
}

// Exemplo de como o botão pode chamar essa função quando clicado
document.getElementById("botaoEnviar").addEventListener("click", enviarDadosParaSheets);
