// Inicializar eventos
document.getElementById('iniciar').addEventListener('click', function () {
    const nome = document.getElementById('nome').value.trim(); // Remover espaços em branco

    if (nome) {
        localStorage.setItem('nome', nome);  // Armazenar nome no localStorage
        console.log('Nome salvo no localStorage:', nome); // Verificar se o nome foi salvo

        // Esconder a tela de inserção de nome
        document.getElementById('form-nome').style.display = 'none';

        // Mostrar a tela de presentes
        document.getElementById('tela-presentes').style.display = 'block';
    } else {
        alert('Por favor, insira seu nome completo!');
    }
});

// Armazenar presentes selecionados
let presentesSelecionados = [];

// Adicionar presentes à lista
document.querySelectorAll('.escolher').forEach(button => {
    button.addEventListener('click', function () {
        const presente = this.getAttribute('data-presente');
        presentesSelecionados.push(presente);
        alert(`${presente} foi adicionado à sua lista!`);
        console.log('Presentes selecionados:', presentesSelecionados); // Verificar presentes
    });
});

// Enviar dados para Google Sheets
document.getElementById('enviar').addEventListener('click', function () {
    const nome = localStorage.getItem('nome');  // Recuperar nome do localStorage
    const data = new Date().toLocaleString();

    if (!nome || nome === "") {
        alert('Nome não encontrado. Por favor, insira seu nome novamente.');
        console.log('Erro: nome não encontrado no localStorage');
        document.getElementById('form-nome').style.display = 'block';
        document.getElementById('tela-presentes').style.display = 'none';
        return;
    }

    if (presentesSelecionados.length === 0) {
        alert('Por favor, selecione ao menos um presente.');
        return;
    }

    // Dados a serem enviados
    const sheetData = {
        "data": data,
        "nome": nome.trim(), // Garantir que o nome é enviado corretamente
        "presentes": presentesSelecionados.join(', ')
    };

    // Fazer a requisição POST para o SheetDB
    fetch('https://sheetdb.io/api/v1/lilmqffgjyxmh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetData),  // Enviar o objeto como JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao criar registro no Google Sheets');
        }
        return response.json();
    })
    .then(data => {
        alert('Lista enviada com sucesso! Obrigado por participar do nosso Chá de Panela!');
        console.log('Success:', data);
        // Limpar lista de presentes selecionados
        presentesSelecionados = [];
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Houve um erro ao enviar sua lista. Detalhes do erro: ' + error.message);
    });
});
