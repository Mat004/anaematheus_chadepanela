// Inicializar o formulário de nome
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

// Variável para armazenar os presentes selecionados
let presentesSelecionados = [];

// Selecionar presentes
document.querySelectorAll('.escolher').forEach(button => {
    button.addEventListener('click', function () {
        const presente = this.getAttribute('data-presente');
        if (!presentesSelecionados.includes(presente)) {  // Evita adicionar o mesmo presente mais de uma vez
            presentesSelecionados.push(presente);
            alert(`${presente} foi adicionado à sua lista!`);
        } else {
            alert('Esse presente já foi adicionado!');
        }
    });
});

// Enviar dados para o Google Sheets via SheetDB
document.getElementById('enviar').addEventListener('click', function () {
    const nome = localStorage.getItem('nome');  // Recuperar o nome armazenado
    const data = new Date().toLocaleString();  // Pegar a data e hora atual
    
    // Verifica se ao menos um presente foi selecionado
    if (presentesSelecionados.length === 0) {
        alert('Por favor, selecione ao menos um presente.');
        return;
    }

    // Preparar os dados para envio
    const sheetData = {
        nome: nome,
        data: data,
        presentes: presentesSelecionados.join(', ')  // Combina todos os presentes em uma única string
    };

    // Enviar os dados usando Fetch API
    fetch('https://sheetdb.io/api/v1/lilmqffgjyxmh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // Tipo de conteúdo enviado
        },
        body: JSON.stringify(sheetData),  // Converter o objeto JS em JSON
    })
    .then(response => {
        return response.json().then(data => {
            if (!response.ok) {
                // Exibir o erro completo vindo do servidor
                console.error('Erro do servidor:', data);
                throw new Error(data.error || 'Erro ao criar registro no Google Sheets');
            }
            return data;
        });
    })
    .then(data => {
        alert('Lista enviada com sucesso! Obrigado por participar do nosso Chá de Panela!');
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error.message || error);
        alert('Houve um erro ao enviar sua lista. Por favor, tente novamente.');
    });
});

