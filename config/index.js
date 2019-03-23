// 配置文件
module.exports ={
  ONE:'http://wufazhuce.com/',////ONE的web版网站
  MOJI_HOST:'https://tianqi.moji.com/weather/china/', //中国墨迹天气url
  CITY:'zhejiang',//收信者所在城市
  LOCATION:'xihu-district',//收信者所在区 （可以访问墨迹天气网站后，查询区的英文拼写）
  MEMORIAL_DAY:'2018/02/13', //你和收信者的纪念日
  NAME:'zhyjor',//备注姓名
  NICKNAME:'zhyjor', //昵称
  SENDDATE:'01 00 00 * * *',//定时发送时间 每天8点15分30秒发送，规则见 /schedule/index.js
  ROOMNAME:'/^微信每日说/i', //群名(请只修改中文，不要删除符号，这是正则)
  ADDFRIENDWORD:'/微信每日说/i',//自动加好友触发的关键词(请只修改中文，不要删除符号，这是正则)
  ADDROOMWORD:'/加群/',//自动发送群图片触发关键词(请只修改中文，不要删除符号，这是正则)
  ROOMCODEURL:'http://image.bloggeng.com/qun.png',//群二维码url链接(与本地群二维码路径选填一个)
  ROOMLOCALPATH:'./static/qun.png',//本地群二维码图片路径（与群url选填一个）

}
