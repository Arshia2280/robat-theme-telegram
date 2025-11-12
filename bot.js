import { Telegraf, Markup } from "telegraf";
import { message } from "telegraf/filters";
import LocalSession from "telegraf-session-local";
const startBot = () => {
  const bot = new Telegraf("8323429167:AAH1SrKF5q3beI45q1rkNuNMZGJ_rFabYYs");
  bot.use((new LocalSession({ database: 'arshia_qr.json' })).middleware());

  const panelAd = Markup.keyboard([['پنل ادمینی']]).resize();
  const menuAd = Markup.keyboard([['افزودن پیام']]).resize();
  const photosAd = Markup.keyboard([['افزودن عکس']]).resize();

  bot.start((ctx, next) => {
    ctx.reply('سلام چطوری میتونم کمکت کنم؟', panelAd);
    ctx.session.id = ctx.from.id;
    ctx.session.id_user = ctx.from.username;
    delete ctx.session.step;
  });
  bot.on(message('text'), async (ctx, next) => {
    switch (ctx.message.text) {
      case "پنل ادمینی":

        const join = await ctx.telegram.getChatMember('@themeglow', ctx.chat.id);
        if (join.status == "administrator" || join.status == "creator") {
          ctx.session.step = 1;
          return ctx.reply('سلام رییس بیا شروع کنیم', photosAd);
        } else {
          return ctx.reply('شما ادمین نیستید', {
            reply_markup: {
              remove_keyboard: true
            }

          });
          delete ctx.session.step;
        }


    }
    return next();
  });
  bot.on([message('text'), message('photo')], (ctx, next) => {
    switch (ctx.session.step) {
      case 1:
        if (ctx.message.text == 'افزودن عکس') {
          ctx.reply('عکس رو بفرست', {
            reply_markup: {
              remove_keyboard: true
            }
          });
          ctx.session.step = 2;
        } else {
          return ctx.reply('شما ادمین نیستید', {
            reply_markup: {
              remove_keyboard: true
            }
          });
        }
        break;

      case 2:
        if (ctx?.message?.photo) {
          ctx.session.photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;
          ctx.reply('حالا لینک رو بفرست');
          ctx.session.step = 3;
        } else {
          delete ctx.session.photo;
          ctx.reply('لطفا عکس درستی رو بفرستید');
        }
        break;
      case 3:
        if (ctx.message.text.includes('https://t.me/addtheme/') && ctx.message.text.length > 28) {
          ctx.session.link = ctx.message.text;
          const addTheme = [[{ text: '𝐀𝐧𝐝𝐫𝗼𝐢𝐝', url: ctx.message.text }]];
          ctx.replyWithPhoto(ctx.session.photo, {
            caption: `<b>                𝐧𝐞𝐰 𝐬𝐭𝐲𝐥𝐞 𝐟𝗼𝐫 𝐲𝗼𝐮𝐫 𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝗺 𝐰𝐢𝐭𝐡
                     <a href="http://t.me/themeglow">        𝘛𝘦𝘭𝘦𝘨𝘳𝘢𝘮 𝘎𝘭𝘰𝘸</a></b>`,
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: addTheme
            },
            has_spoiler: true,
            chat_id: '@themeglow'
          });
          ctx.reply('پیام شما ساخته شد');
          console.log('your message craete :)')
          ctx.session.step = 2;
        } else {
          delete ctx.session.link;
          ctx.reply('لطفا لینک تم رو درست بفرستید');
        }
}
  });


bot.launch();
};



export { startBot };
