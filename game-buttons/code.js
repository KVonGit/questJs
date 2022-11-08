"use strict"

/*
new Cmd('Charge', {
  npcCmd:true,
  regex:/^(?:charge|power) (.+)$/,
  objects:[
    {scope:parser.isHeld}
  ],
  defmsg:"{pv:item:'be:true} not something you can charge.",
})
*/









io.getItemHtml = function(item, loc, isSubItem, highlight) {
  const verbList = item.getVerbs(loc)
  if (verbList === undefined) { errormsg("No verbs for " + item.name); console.log(item); }

  let s = '<p id="' + item.name + '-item" class="item-class"><span class="item-name">' + item.getListAlias(loc) + ':</span>'
  for (let verb of verbList) {
    if (typeof verb === 'string') verb = {name:verb, action:verb}
    s += ' <span class="item-action-button" onclick="io.clickItemAction(\'' + item.name + '\', \'' + verb.action + '\')">';
    s += verb.name;
    s += '</span>';
  }
  s += '</p>'
  return s
}







parser.isRoom =function(o) { return o.room }

new Cmd('GoTo', {
  npcCmd:true,
  regex:/^(?:go to|go) (.+)$/,
  objects:[
    {scope:parser.isRoom}
  ],
  script:function(objects) {
    const room = objects[0][0]
    if (room === currentLocation) return failedmsg("As if by magic, you are suddenly... where you already were.")
    if (!room.room) return failedmsg("{pv:item:be:true} not a destination.", {item:room})
    for (const ex of currentLocation.dests) {
      if (room.name === ex.name) {
        return ex.use(player, ex) ? world.SUCCESS : world.FAILED
      }
    }
    return failedmsg("{pv:item:be:true} not a destination you can get to from here.", {item:room})
  },
})



parser.isContact = function(o) { return o.contact }



const smartPhoneFunctions = ["Contacts", "Take photo", "Photo gallery", "Search internet", "Hang up", "News feed"]

for (let el of smartPhoneFunctions) {
  new Cmd(el, {
    regex:new RegExp('^' + el.toLowerCase() + ' (.+)$'),
    attName:verbify(el),
    objects:[
      {scope:parser.isHeld},
    ],
    defmsg:"{pv:item:'be:true} not something you can do that with.",
  })
}



new Cmd('Phone', {
  npcCmd:true,
  regex:/^(?:telephone|phone|call|contact) (.+)$/,
  objects:[
    {scope:parser.isContact}
  ],
  script:function(objects) {
    return w.phone.makeCall(objects[0][0]) ? world.SUCCESS : world.FAILED
  },
})



new Cmd('HangUp', {
  npcCmd:true,
  regex:/^(?:hang up|end call)$/,
  objects:[
  ],
  script:function() {
    if (!player.onPhoneTo) return failedmsg("You are not on a call.")
    w.phone.hangUp()
    return world.SUCCESS
  },
})







new Cmd('DialogTest', {
  npcCmd:true,
  regex:/^(?:dialog) (.*)$/,
  objects:[
  {special:'text'},
  ],
  script:function(objects) {
    const funcName = parser.currentCommand.string.replace(/dialog /i, '')
    log(funcName)
    const choices = ['red', 'yellow', 'blue']
    io.menuFunctions[funcName]('Pick a colour?', choices, function(result) {
      msg("You picked " + result)
    })
    return world.SUCCESS_NO_TURNSCRIPTS
  },
})

