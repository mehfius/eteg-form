import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { serializerCompiler, validatorCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod';
import { PrismaClient } from '@prisma/client';
import { clientSchema } from '@eteg/shared';
import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const prisma = new PrismaClient();
const server = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

// Configura compiladores do Zod no Fastify
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// Middlewares
server.register(helmet, { global: true });
server.register(cors, { origin: '*' });
server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// Swagger (OpenAPI) setup integrado automaticamente com o Zod!
server.register(swagger, {
  openapi: {
    info: {
      title: 'Eteg Form API',
      description: 'API extremamente rápida e documentada para cadastro de clientes VIP.',
      version: '1.0.0'
    },
    servers: [{ url: 'http://192.168.195.10:8080' }]
  },
  transform: jsonSchemaTransform
});

server.register(swaggerUi, {
  routePrefix: '/docs',
});

// Rotas
server.get('/api/colors', {
  schema: {
    description: 'Retorna todas as cores cadastradas',
    tags: ['Colors'],
    response: {
      200: z.array(z.object({
        id: z.string(),
        name: z.string(),
        hexCode: z.string()
      }))
    }
  }
}, async (request, reply) => {
  const colors = await prisma.color.findMany();
  return colors;
});

server.post('/api/clients', {
  schema: {
    description: 'Cadastra um novo cliente validando os dados com Zod',
    tags: ['Clients'],
    body: clientSchema,
    response: {
      201: z.object({
        id: z.string(),
        fullName: z.string(),
        email: z.string()
      })
    }
  }
}, async (request, reply) => {
  const data = request.body;
  
  // Verifica se CPF ou Email já existem
  const exists = await prisma.client.findFirst({
    where: {
      OR: [ { cpf: data.cpf }, { email: data.email } ]
    }
  });

  if (exists) {
    return reply.status(400).send({ message: 'CPF ou E-mail já cadastrados.' });
  }

  const client = await prisma.client.create({
    data: {
      fullName: data.fullName,
      cpf: data.cpf,
      email: data.email,
      observations: data.observations,
      colorId: data.colorId
    }
  });

  return reply.code(201).send({
    id: client.id,
    fullName: client.fullName,
    email: client.email
  });
});

// Inicialização
const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🔥 Backend rodando com Fastify na porta 3000');
    console.log('📚 Swagger UI disponível em /docs');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
