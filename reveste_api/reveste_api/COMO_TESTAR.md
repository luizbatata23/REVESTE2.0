

Siga estes passos para colocar tudo para rodar no seu computador:

## 1. Preparação do Banco de Dados (XAMPP)
1. Abra o **XAMPP Control Panel**.
2. Inicie o **Apache** e o **MySQL**.
3. Clique no botão **Admin** do MySQL ou acesse `http://localhost/phpmyadmin` no navegador.
4. Crie um banco de dados chamado `reveste_db`.
5. Clique na aba **Importar** e selecione o arquivo `setup.sql` (que está na pasta `reveste-api`) OU clique na aba **SQL** e cole o conteúdo do arquivo `setup.sql` lá. Execute.

## 2. Iniciando o Backend (Servidor)
1. Abra o terminal (ou CMD/PowerShell) na pasta `reveste-api`.
2. Instale as dependências (necessário apenas na primeira vez):
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   node index.js
   ```
4. Você deverá ver a mensagem: `Reveste API (Login Only) rodando em http://localhost:8080`.

## 3. Testando o Login no Frontend
1. Vá para a pasta `reveste-web/html`.
2. Abra o arquivo `login.html` no seu navegador (clique duas vezes nele).
3. Tente fazer login com as credenciais padrão:
   - **E-mail:** `teste@reveste.com`
   - **Senha:** `123`
4. Se tudo estiver certo, você verá um alerta de "Sucesso" e será levado para a página de vitrine!

---- Inserir um usuário de teste
--INSERT INTO usuarios (nome, email, senha, role) 
--VALUES ('Administrador', 'admin@reveste.com', '123456', 'admin')
--ON DUPLICATE KEY UPDATE email=email;
--
--INSERT INTO usuarios (nome, email, senha, role) 
--VALUES ('Usuário Teste', 'teste@reveste.com', '123', 'user')
--ON DUPLICATE KEY UPDATE email=email;
--

## 💡 Dicas de Teste
- **Sem XAMPP:** Se você fechar o XAMPP e tentar logar, a API avisará no terminal que está usando o "Fallback JSON", mas o login `teste@reveste.com` continuará funcionando porque ele também está no arquivo `users.json`.
- **Inspecionar:** No navegador, aperte `F12` e vá na aba **Console** para ver se aparece algum erro de conexão caso o login falhe.
- **Porta 8080:** Certifique-se de que nenhuma outra aplicação está usando a porta 8080.
