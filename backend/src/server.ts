import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");

    app.listen(env.PORT, () => {
      console.log(`Servidor rodando na porta ${env.PORT}...`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
}

bootstrap();
