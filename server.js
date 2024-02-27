import { fastify } from "fastify";
import { DatabaseMemory } from "./database-memory.js";
import { DatabasePostgres } from "./database-postgres.js";

const server = fastify();

// const database = new DatabaseMemory();
const database = new DatabasePostgres();

// Route Parameter -> <someRoute>/:{parameter}
// Query params (opcionais?)

server.post("/videos", async(request, reply) => {
  const { title, description, duration } = request.body;
  await database.create({
    title: title,
    // short sintaxe
    description,
    duration,
  });

  return reply.status(201).send();
  // http status code 201 => algo foi criado
});

server.get("/videos", async (request) => {
  const search = request.query.search;
  const videos = await database.list(search);

  // 200 success
  return videos;
});

server.put("/videos/:id", async (request, reply) => {
  const { title, description, duration } = request.body;
  const videoId = request.params.id;

  await database.update(videoId, {
    title,
    description,
    duration,
  });

  return reply.status(204).send();
  // status code 204 -> success without content
});

server.delete("/videos/:id", async (request, reply) => {
  const id = request.params.id;

  await database.delete(id);

  return reply.status(204).send();
});

server.listen({
  port: process.env.PORT ?? 3333,
});
