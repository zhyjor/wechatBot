/**
 * WechatBot
 *  - https://github.com/gengchen528/wechatBot
 */
const { Wechaty, Friendship } = require('wechaty')
const schedule = require('./schedule/index')
const config = require('./config/index')
const untils = require('./untils/index')
const superagent = require('./superagent/index')
const { FileBox } = require('file-box') //文件读取模块
//  二维码生成
function onScan(qrcode, status) {
  require('qrcode-terminal').generate(qrcode)  // 在console端显示二维码
  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')
  console.log(qrcodeImageUrl)
}

// 登录
async function onLogin(user) {
  console.log(`贴心小助理${user}登录了`)
  // 登陆后创建定时任务
  schedule.setSchedule(config.SENDDATE, () => {
    console.log('你的贴心小助理开始工作啦！')
    main()
  })
}

//登出
function onLogout(user) {
  console.log(`${user} 登出`)
}

// 监听对话 根据关键词自动加群
async function onMessage(msg) {
  const contact = msg.from() // 发消息人
  const content = msg.text() //消息内容
  const room = msg.room() //是否是群消息
  const roomCodeUrl = FileBox.fromUrl(config.ROOMCODEURL) //来自url的文件
  const roomCodeLocal = FileBox.fromFile(config.ROOMLOCALPATH) //添加本地文件
  if (msg.self()) {
    return
  }
  if (room) { // 如果是群消息
    const topic = await room.topic()
    console.log(`群名: ${topic} 发消息人: ${contact.name()} 内容: ${content}`)
  } else { // 如果非群消息
    console.log(`发消息人: ${contact.name()} 消息内容: ${content}`)
    let addRoomReg = eval(config.ADDROOMWORD)
    let roomReg = eval(config.ROOMNAME)
    if (addRoomReg.test(content) && !room) {
      let keyRoom = await this.Room.find({ topic: roomReg })
      if (keyRoom) {
        try {
          await contact.say(roomCodeLocal || roomCodeUrl)
          await keyRoom.say('微信每日说：欢迎新朋友', contact)
        } catch (e) {
          console.error(e)
        }
      }
    } else {
      await contact.say('你好，不要轻易调戏我，我只会发群二维码，不会聊天的！')
      await contact.say('请回复暗号：加群  获取群二维码图片')
    }
  }
}

// 自动加好友功能
async function onFriendShip(friendship) {
  let logMsg
  try {
    logMsg = '添加好友' + friendship.contact().name()
    console.log(logMsg)

    switch (friendship.type()) {
      /**
       *
       * 1. New Friend Request
       *
       * when request is set, we can get verify message from `request.hello`,
       * and accept this request by `request.accept()`
       */
      case Friendship.Type.Receive:
        let addFriendReg = eval(config.ADDFRIENDWORD)
        if (addFriendReg.test(friendship.hello())) {
          logMsg = '自动添加好友，因为验证信息中带关键字‘每日说’'
          await friendship.accept()
        } else {
          logMsg = '没有通过验证 ' + friendship.hello()
        }
        break
      /**
       *
       * 2. Friend Ship Confirmed
       *
       */
      case Friendship.Type.Confirm:
        logMsg = 'friend ship confirmed with ' + friendship.contact().name()
        break
    }
  } catch (e) {
    logMsg = e.message
  }
  console.log(logMsg)
}

// 自动发消息功能，
async function main() {
  let contact = await bot.Contact.find({ name: config.NICKNAME }) || await bot.Contact.find({ alias: config.NAME }) // 获取你要发送的联系人
  let one = await superagent.getOne() //获取每日一句
  let weather = await superagent.getWeather() //获取天气信息
  let today = await untils.formatDate(new Date())//获取今天的日期
  let memorialDay = untils.getDay(config.MEMORIAL_DAY)//获取纪念日天数
  // let str = today + '<br>' + '今天是我们在一起的第' + memorialDay + '天'
  let str =  '丫头注意今天的天气<br><br>' + weather.weatherTips + '<br><br>' + weather.todayWeather ;
    // + '每日一句:<br><br>' + one + '<br><br>' + '------来自最爱你的我'
  await contact.say(str).catch(e => console.error(e))//发送消息
}

const bot = new Wechaty()

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
// bot.on('message', onMessage)
// bot.on('friendship', onFriendShip)

bot.start()
  .then(() => console.log('开始登陆微信'))
  .catch(e => console.error(e))
