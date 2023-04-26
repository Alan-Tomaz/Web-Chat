Salvar o código dos emotes como €${texto} Susbtituir no frontend pelo emote relacionado;

salvar o codigo da imagem ou do iframe por [img=${url}] ou [youtube=${url}] e no frontend verificar todas mensagens,e sempre que for detectado esses caracteres substituir pelo codigo da img ou do iframe.
regex: /\[img=https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)\]/gm
