const Discord        = require('discord.js'),
      { Canvas }     = require('canvas-constructor'),
      fsn            = require('fs-nextra');

exports.run = async(client, message, args, tools) => {
    
    try {
        
        //Canvas.registerFont('.././Linotte-SemiBold.otf', 'Linotte')
        
        let image = new Canvas(300, 400)
            .setTextFont('28px Arial')
            .setTextAlign('center')
            .addText('Hello World', 150, 370)
            
        console.log(image)
        message.channel.send({
            files: [image.toBuffer()]
        })
        
    } catch (e) { // Post Errors
        message.channel.send(`**Error:**\`\`\`js\n${JSON.stringify(e.message)}\`\`\``);
    }

};
