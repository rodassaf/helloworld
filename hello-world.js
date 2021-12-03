var botui = new BotUI('hello-world');
var name = null;

botui.message.bot({ // show first message
  delay: 200,
  content: 'hello iX fellow'
}).then(() => {
  return botui.message.bot({ // second one
    delay: 1000, // wait 1 sec.
    content: 'what is your name?'
  })
}).then(() => {
  return botui.action.text({ // let the user perform an action
    delay: 1000,
    action: [
      { // show only one button
        placeholder: 'Your Name'
      }
    ]
  })
}).then((res) => {
  name = res.value;
  return botui.message.bot({ // second one
    delay: 1000, // wait 1 sec.
    content: `${res.value}, did you know iX teachers are the best?`
  })
}).then(() => {
  return botui.action.button({ // let the user perform an action
    delay: 1000,
    action: [
      { // show only one button
        text: 'Yes',
        value: 'one'
      },
      { // show only one button
        text: 'Of Course',
        value: 'two'
      }
    ]
  })
}).then(res => {
  return botui.message.bot({
    delay: 1000,
    content: name+', do not miss our Prototyping Class! See you there!'
  })
})
