// Armazenar presentes selecionados
let presentesSelecionados = [];

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

// Adicionar presentes à lista
document.querySelectorAll('.escolher').forEach(button => {
    button.addEventListener('click', function () {
        const presente = this.getAttribute('data-presente');
        presentesSelecionados.push(presente);
        alert(`${presente} foi adicionado à sua lista!`);
    });
});

// Enviar dados para o Google Sheets via SheetDB
document.getElementById('enviar').addEventListener('click', function () {
    const nome = localStorage.getItem('nome');
    const data = new Date().toLocaleString();

    if (presentesSelecionados.length === 0) {
        alert('Por favor, selecione ao menos um presente.');
        return;
    }

    // Formatar os dados como um array de objetos
    const sheetData = [
        {
            "nome": nome,
            "data": data,
            "presentes": presentesSelecionados.join(', ')
        }
    ];

    // Fazer a requisição POST para o SheetDB
    fetch('https://sheetdb.io/api/v1/lilmqffgjyxmh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetData),
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
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Houve um erro ao enviar sua lista. Detalhes do erro: ' + error.message);
    });
});
