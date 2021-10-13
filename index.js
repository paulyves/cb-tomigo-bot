const { Client, Intents } = require('discord.js');
const { token, bscToken, bscAddressAPI, poolAddress, contractAddr } = require('./config.json');
const { d30API } = require('./api.json');
const axios = require('axios');
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});

client.once('ready', async () => {
  console.log('Meow!!')
  listenRewardsPool();
})
client.on('messageCreate', async (msg) => {
  if (msg.content === 'yo tomigo')
    return msg.channel.send('Meow!!!')
  if (msg.content === 'pool') {
    try {
      const response = await getRewardsPool()
      const data = response.data
      let pool = null
      if (typeof data !== 'undefined' && data.status == 1) {
        pool = parseInt(data.result) / 1000000000000000000
        let emoji = pool > 0.1 ? ':heart_eyes_cat:' : ':crying_cat_face:';
        return msg.channel.send(`${pool.toFixed(3)} SKILL ${emoji}`)
      }
    } catch (error) {
      console.log(error);
    }
  }
  else if (msg.content.startsWith('gimme')) {
    let param = msg.content.split('gimme')[1].trim();
    if (param.split(' ').length == 1) {
      const userInput = param.split(' ')[0];
      switch (userInput) {
        case 'poo':
          try {
            const response = await getD30Shit()
            const data = response.data;
            const emb = createEmbed(data)
            msg.channel.send({ embeds: [emb] })
          } catch (error) {
            console.log(error);
          }

          break;
        case 'love':
          msg.channel.send(`:heart_eyes_cat:`)
          break;

        default:
          msg.channel.send(`I don't have ${userInput} for you at the moment. :scream_cat:`)
          break;
      }

    }
  }
})





client.login(token)

const getRewardsPool = async () => {
  return axios({
    method: 'get',
    url: bscAddressAPI,
    responseType: 'json',
    params: {
      module: 'account',
      action: 'tokenbalance',
      contractaddress: contractAddr,
      address: poolAddress,
      tag: 'latest',
      apiKey: bscToken
    }
  })
};
const listenRewardsPool = async () => {
  setInterval(async () => {
    try {
      const response = await getRewardsPool()
      const data = response.data
      let pool = null
      if (typeof data !== 'undefined' && data.status == 1) {
        pool = parseInt(data.result) / 1000000000000000000
        console.log(`pool @ ${pool.toFixed(6)} SKILL`, new Date());
        if(pool < 10 && pool > 1){
          const user = await client.users.fetch("362862180648878080")
          client.channels.cache.find(i => i.name === 'bot-commands').send(`meow! CB pool is now @ ${pool.toFixed(3)} SKILL`)
        }
        return client.user.setActivity(`pool @ ${pool.toFixed(3)} SKILL`, { type: 'WATCHING' });
      }
    } catch (error) {
      console.log(error);
    }
  }, 10000)
};

const getD30Shit = async () => {
  return axios({
    method: 'get',
    url: d30API,
    responseType: 'json'
  })
};

const createEmbed = (data) => {
  const urlD30 = randomizeD30();
  const embedObj = {
    title: `:poop: ${data.context} :poop:`,
    url: data.sources[0].link,
    description: `"${data.quote}"`,
    image: {
      url: urlD30,
    },
  }
  return embedObj;
}
const randomizeD30 = () => {
  let imgDuts = [
    "https://i.imgur.com/9wP3JNB.jpeg",
    "https://i.imgur.com/kXDi2Gs.jpeg",
    "https://i.imgur.com/DJMTH5U.jpeg",
    "https://i.imgur.com/UvWHlOh.png",
    "https://i.imgur.com/vugeqRi.jpeg",
    "https://i.imgur.com/eiduQD6.jpeg"
  ]

  min = Math.ceil(1);
  max = Math.floor(6);
  const rand = Math.floor(Math.random() * (max - min) + min)
  return imgDuts[rand];
}