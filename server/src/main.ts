import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Rapier from "@dimforge/rapier2d-compat"

async function bootstrap() {
 await Rapier.init(); 
 
 

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders:"*",
    origin:"*"
  })
  app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', "*");
    next();
  })
  await app.listen(3000);
}
bootstrap();
