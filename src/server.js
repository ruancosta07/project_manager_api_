import { server } from "./websocket/users"; // Certifique-se de que o caminho está correto
const PORT = process.env.PORT || 3000;

function main() {
  try {
    // Corrigido: a callback deve estar dentro do método listen corretamente
    server.listen(PORT, (err) => {
      if (err) {
        console.error("Erro ao iniciar o servidor:", err);
        return;
      }
      console.log(`Server is running at port ${PORT}`);
    });
  } catch (err) {
    console.error("Erro durante a inicialização:", err);
  }
}

main();
