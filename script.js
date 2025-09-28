// Elementos do DOM
const magicLettersInput = document.getElementById('magic-letters');
const powerWordsInput = document.getElementById('power-words');
const liberarBtn = document.getElementById('liberar-btn');
const voltarBtn = document.getElementById('voltar-btn');
const resultSection = document.getElementById('result-section');
const resultContent = document.getElementById('result-content');

// Estado inicial dos dados
let initialState = {
  magicLetters: '',
  powerWords: ''
};

// Função principal para encontrar a palavra mais longa
function findLongestWord(magicLetters, dictionary) {
  let longestWord = '';
  let validWords = [];
  let calculations = [];

  // Converte as letras mágicas em um mapa de contagem
  const availableLetters = {};
  for (let letter of magicLetters.toLowerCase()) {
    availableLetters[letter] = (availableLetters[letter] || 0) + 1;
  }

  calculations.push({
    step: 'Análise das Letras Mágicas',
    content: `Letras disponíveis: ${magicLetters} → ${JSON.stringify(availableLetters)}`
  });

  // Verifica cada palavra do dicionário
  for (let word of dictionary) {
    const wordLower = word.toLowerCase().trim();
    const canForm = canFormWord(wordLower, availableLetters);

    calculations.push({
      step: `Verificando "${word}"`,
      content: canForm.explanation
    });

    if (canForm.possible) {
      validWords.push(word);
      if (wordLower.length > longestWord.length) {
        longestWord = word;
      }
    }
  }

  return {
    longestWord,
    validWords,
    calculations,
    availableLetters
  };
}

// Função para verificar se uma palavra pode ser formada
function canFormWord(word, availableLetters) {
  const wordLetters = {};

  // Conta as letras necessárias para a palavra
  for (let letter of word) {
    wordLetters[letter] = (wordLetters[letter] || 0) + 1;
  }

  // Verifica se temos letras suficientes
  for (let letter in wordLetters) {
    const needed = wordLetters[letter];
    const available = availableLetters[letter] || 0;

    if (needed > available) {
      return {
        possible: false,
        explanation: `❌ Precisa de ${needed} "${letter}", mas só tem ${available} disponível`
      };
    }
  }

  return {
    possible: true,
    explanation: `✅ Pode ser formada! Letras necessárias: ${JSON.stringify(wordLetters)}`
  };
}

// Função para limpar e processar entrada de palavras
function processWords(wordsString) {
  return wordsString
    .split(',')
    .map(word => word.trim())
    .filter(word => word.length > 0);
}

// Função para exibir o resultado detalhado
function displayResult(result, magicLetters, originalWords) {
  if (result.longestWord === '') {
    resultContent.innerHTML = `
            <div class="error-message">
                <h4>⚠️ Nenhuma palavra pode ser formada!</h4>
                <p>As letras mágicas "${magicLetters}" não são suficientes para formar nenhuma das palavras fornecidas.</p>
            </div>
        `;
    return;
  }

  let html = `
        <div class="calculation-step">
            <h4>📋 Dados de Entrada:</h4>
            <p><strong>Letras Mágicas:</strong> ${magicLetters}</p>
            <p><strong>Palavras de Poder:</strong> [${originalWords.join(', ')}]</p>
        </div>
    `;

  // Adiciona cada passo do cálculo
  result.calculations.forEach((calc, index) => {
    html += `
            <div class="calculation-step">
                <h4>${index + 1}. ${calc.step}</h4>
                <p>${calc.content}</p>
            </div>
        `;
  });

  // Resumo das palavras válidas
  if (result.validWords.length > 0) {
    html += `
            <div class="calculation-step">
                <h4>🎯 Palavras Válidas Encontradas:</h4>
                <p>${result.validWords.map(word => `"${word}" (${word.length} letras)`).join(', ')}</p>
            </div>
        `;
  }

  // Resultado final destacado
  html += `
        <div class="final-result">
            <h4>⚔️ Saída Esperada:</h4>
            <p>"${result.longestWord}" (${result.longestWord.length} letras)</p>
            <small>🏆 Maior palavra que pode ser formada com as letras mágicas!</small>
        </div>
    `;

  resultContent.innerHTML = html;

  // Rola para mostrar o resultado
  resultSection.scrollTop = resultSection.scrollHeight;
}

// Função para validar entradas
function validateInputs() {
  const magicLetters = magicLettersInput.value.trim();
  const powerWords = powerWordsInput.value.trim();

  if (!magicLetters) {
    alert('⚠️ Por favor, insira as letras mágicas!');
    magicLettersInput.focus();
    return null;
  }

  if (!powerWords) {
    alert('⚠️ Por favor, insira as palavras de poder!');
    powerWordsInput.focus();
    return null;
  }

  // Remove caracteres especiais das letras mágicas
  const cleanMagicLetters = magicLetters.replace(/[^a-zA-ZáàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]/g, '');

  if (cleanMagicLetters.length === 0) {
    alert('⚠️ As letras mágicas devem conter apenas letras válidas!');
    magicLettersInput.focus();
    return null;
  }

  const wordsArray = processWords(powerWords);

  if (wordsArray.length === 0) {
    alert('⚠️ Por favor, insira pelo menos uma palavra de poder válida!');
    powerWordsInput.focus();
    return null;
  }

  return {
    magicLetters: cleanMagicLetters,
    dictionary: wordsArray
  };
}

// Event listener para o botão LIBERAR
liberarBtn.addEventListener('click', () => {
  const inputs = validateInputs();
  if (!inputs) return;

  // Salva o estado inicial para o botão voltar
  initialState = {
    magicLetters: inputs.magicLetters,
    powerWords: powerWordsInput.value.trim()
  };

  // Processa o desafio
  const result = findLongestWord(inputs.magicLetters, inputs.dictionary);

  // Exibe o resultado
  displayResult(result, inputs.magicLetters, inputs.dictionary);

  console.log('🐲 Desafio processado:', {
    input: inputs,
    result: result
  });
});

// Event listener para o botão VOLTAR
voltarBtn.addEventListener('click', () => {
  // Limpa os campos
  magicLettersInput.value = '';
  powerWordsInput.value = '';

  // Restaura mensagem inicial
  resultContent.innerHTML = `
        <p class="waiting-message">Aguardando as letras mágicas e palavras de poder...</p>
    `;

  // Foca no primeiro campo
  magicLettersInput.focus();

  console.log('🔄 Estado resetado - Pronto para novo desafio');
});

// Event listeners para Enter nos campos de input
magicLettersInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    powerWordsInput.focus();
  }
});

powerWordsInput.addEventListener('keypress', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    liberarBtn.click();
  }
});

// Inicialização - Remove exemplo padrão
window.addEventListener('load', () => {
  // Deixa os campos vazios, apenas com placeholders
  magicLettersInput.value = '';
  powerWordsInput.value = '';

  console.log('🐲 Samurai Dragão - Sistema inicializado');
  console.log('⚔️ Digite suas letras mágicas e palavras de poder para começar');
});
