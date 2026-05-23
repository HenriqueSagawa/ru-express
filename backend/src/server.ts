import app from "./app";
import { env } from "./config/env";

async function bootstrap() {
  try {
    app.listen(env.PORT, () => {
      console.log(`Servidor rodando na porta ${env.PORT}...`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
}

bootstrap();
