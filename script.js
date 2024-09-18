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

    fetch('https://sheetdb.io/api/v1/YOUR_SHEET_ID', {
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
