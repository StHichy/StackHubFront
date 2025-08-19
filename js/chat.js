        // Sidebar toggle functionality
        const conversaBtn = document.getElementById("conversa");
        const sidebar = document.querySelector(".sidebar");
        const mainContent = document.querySelector(".main-content");
        
        conversaBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active");
            mainContent.classList.toggle("shrink");
        });
        
        // Chat functionality
        const messageInput = document.getElementById('messageInput');
        const sendMessageBtn = document.getElementById('sendMessageBtn');
        const chatMessages = document.getElementById('chatMessages');
        
        // Function to send a message
        function sendMessage() {
            const message = messageInput.value.trim();
            if (message) {
                // Create message element
                const messageElement = document.createElement('div');
                messageElement.classList.add('message', 'sender');
                
                const now = new Date();
                const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                                  now.getMinutes().toString().padStart(2, '0');
                
                messageElement.innerHTML = `
                    <div>${message}</div>
                    <div class="message-time">${timeString}</div>
                    <div class="message-status"><i class="fas fa-check"></i></div>
                `;
                
                chatMessages.appendChild(messageElement);
                messageInput.value = '';
                
                // Auto scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Simulate reply after 1-3 seconds
                setTimeout(simulateReply, 1000 + Math.random() * 2000);
            }
        }
        
        // Simulate a reply from the other person
        function simulateReply() {
            const replies = [
                "Entendido!",
                "Ótimo, obrigado!",
                "Vou verificar isso agora.",
                "Perfeito, continue assim.",
                "Precisamos discutir isso na reunião.",
                "Você pode me enviar mais detalhes?",
                "Aceito sua sugestão.",
                "Vou preparar o documento e te envio."
            ];
            
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'receiver');
            
            const now = new Date();
            const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                              now.getMinutes().toString().padStart(2, '0');
            
            messageElement.innerHTML = `
                <div>${randomReply}</div>
                <div class="message-time">${timeString}</div>
            `;
            
            chatMessages.appendChild(messageElement);
            
            // Auto scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Event listeners
        sendMessageBtn.addEventListener('click', sendMessage);
        
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Add click event to sidebar contacts
        document.querySelectorAll('.sidebar .nav-link').forEach(link => {
            link.addEventListener('click', function() {
                // Remove active class from all
                document.querySelectorAll('.sidebar .nav-link').forEach(el => {
                    el.classList.remove('active');
                });
                
                // Add active class to clicked
                this.classList.add('active');
                
                // Update chat header with contact info
                const contactName = this.querySelector('h6').textContent;
                const contactImg = this.querySelector('img').src;
                const status = this.querySelector('small').textContent;
                
                document.querySelector('.chat-header img').src = contactImg;
                document.querySelector('.chat-header h5').textContent = contactName;
                document.querySelector('.chat-header .status').textContent = status === '🟢online' ? '🟢 Online' : '🔴 Offline';
            });
        });
        
        // Auto scroll to bottom on load
        window.addEventListener('load', () => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });