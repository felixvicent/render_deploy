import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import { z } from "zod";

const app = express();

const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

app.get("/users", async (request, response) => {
  const users = await prisma.user.findMany();

  return response.json(users);
});

app.post("/users", async (request, response) => {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
  });

  const { name, email } = createUserSchema.parse(request.body);

  await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  return response.sendStatus(201);
});

app.listen(PORT, () => console.log(`HTTP Server running on port ${PORT} `));
