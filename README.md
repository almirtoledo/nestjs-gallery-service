# Listings Gallery

Este case de estudo simula um gateway publicando 60 mil listings, cada um com 30 imagens de servidor remoto. (total de 1.800.000 imagens).

Pretendemos disponibilizar as imagens o mais rapido possível, logo persistimos e utlizamos com link do servidor remoto, porem acionamos um processo de a parte, onde de maneira mais lenta realizamos o download as imagens para nosso storage, e atualizamos o banco de dados a medida que a demanda seja concluida.

- Testado com Node 20.13.0 - PC: Core i3 13th | 20 threads | 32G ram

## Comandos

```bash
cp .env.exemple .env
```

```bash
docker compose -f kafka.yml up -d
```

```bash
docker compose -f db.yml up -d
```

```bash
mkdir storage
```

```bash
npm i
```

```bash
npm prisma migrate deploy
```

```bash
npm prisma generate
```

Gateway mock service

```bash
npm run start:dev gateway
```

Gallery service

```bash
npm run start:dev gallery
```
