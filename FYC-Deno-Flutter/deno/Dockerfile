FROM hayd/alpine-deno:1.3.3
EXPOSE 1337

WORKDIR /app

RUN deno install -qAf --unstable "https://deno.land/x/denon@2.4.4/denon.ts"

COPY deps.ts .

RUN deno cache --lock=lock.json --lock-write deps.ts

ADD . .

RUN deno cache index.ts

ENTRYPOINT ["denon"]

CMD ["run", "--allow-read","--allow-net", "--allow-env","--unstable", "index.ts"]
