document.addEventListener('DOMContentLoaded', function() {
    // Lista de habilidades disponíveis (você pode personalizar esta lista)
    const habilidades = [
        "JavaScript", "HTML/CSS", "React", "Node.js", "Python",
        "Java", "PHP", "SQL", "Git", "UI/UX Design",
        "TypeScript", "Vue.js", "Angular", "C#", "Ruby",
        "Swift", "Kotlin", "Docker", "AWS", "Machine Learning",
        "Photoshop", "Illustrator", "Figma", "After Effects",
        "WordPress", "SEO", "Marketing Digital", "Vendas"
    ];

    const availableTagsContainer = document.getElementById('available-tags');
    const selectedTagsContainer = document.getElementById('selected-tags');
    const tagsCounter = document.getElementById('tags-counter');
    const hiddenInput = document.getElementById('hidden-habilidade-principal');
    
    let selectedTags = [];

    // Criar tags disponíveis
    habilidades.forEach(habilidade => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.textContent = habilidade;
        tag.addEventListener('click', () => toggleTag(habilidade, tag));
        availableTagsContainer.appendChild(tag);
    });

    // Função para alternar a seleção de uma tag
    function toggleTag(habilidade, tagElement) {
        const index = selectedTags.indexOf(habilidade);
        
        if (index === -1) {
            // Adicionar tag se não atingiu o limite
            if (selectedTags.length < 3) {
                selectedTags.push(habilidade);
                tagElement.classList.add('selected');
                updateSelectedTags();
                updateCounter();
                updateHiddenInput();
            } else {
                showNotification("Limite de 3 habilidades atingido!", true);
            }
        } else {
            // Remover tag
            selectedTags.splice(index, 1);
            tagElement.classList.remove('selected');
            updateSelectedTags();
            updateCounter();
            updateHiddenInput();
        }
    }

    // Atualizar a lista de tags selecionadas
    function updateSelectedTags() {
        selectedTagsContainer.innerHTML = '';
        
        selectedTags.forEach(habilidade => {
            const selectedTag = document.createElement('div');
            selectedTag.className = 'selected-tag';
            
            const tagText = document.createElement('span');
            tagText.textContent = habilidade;
            
            const removeBtn = document.createElement('span');
            removeBtn.className = 'remove';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', () => {
                const index = selectedTags.indexOf(habilidade);
                if (index !== -1) {
                    selectedTags.splice(index, 1);
                    // Remover a classe 'selected' da tag correspondente
                    const tags = availableTagsContainer.querySelectorAll('.tag');
                    tags.forEach(tag => {
                        if (tag.textContent === habilidade) {
                            tag.classList.remove('selected');
                        }
                    });
                    updateSelectedTags();
                    updateCounter();
                    updateHiddenInput();
                }
            });
            
            selectedTag.appendChild(tagText);
            selectedTag.appendChild(removeBtn);
            selectedTagsContainer.appendChild(selectedTag);
        });
    }

    // Atualizar o contador
    function updateCounter() {
        tagsCounter.textContent = `Selecionadas: ${selectedTags.length}/3`;
        
        if (selectedTags.length >= 3) {
            tagsCounter.classList.add('limit-reached');
        } else {
            tagsCounter.classList.remove('limit-reached');
        }
    }

    // Atualizar o campo hidden
    function updateHiddenInput() {
        hiddenInput.value = selectedTags.join(', ');
    }

    // Mostrar notificação
    function showNotification(message, isError = false) {
        // Criar elemento de notificação se não existir
        let notification = document.getElementById('tags-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'tags-notification';
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        
        if (isError) {
            notification.classList.add('error');
        } else {
            notification.classList.remove('error');
        }
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Inicializar
    updateCounter();
});