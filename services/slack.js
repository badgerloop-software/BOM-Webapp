const request = require('request');
const rp = require('request-promise');
const URL = process.env.SERVICES_TOKEN;
/**
 * @param {String} channel The Slack Channel ID
 * @param {String} msg The message text
 * @param {Array} attachments optional array of attachments
 * @callback (body) Returns the body of the response
 */
exports.sendMessage = function sendMessage(channel, msg, attachments, cb) {
        var options = {
          msg: msg,
          method: 'POST',
          url: 'https://slack.com/api/chat.postMessage',
          headers:
          {
            Authorization: 'Bearer ' + URL,
            'Content-Type': 'application/json'
          },
          body: { channel: channel, text: msg, attachments: attachments },
          json: true
        };
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          if(cb) cb(body);
          else return;
        });
}
/**
 * Threads a message on an existing message
 */
exports.sendThread = function(channel, msg, attachments, ts, cb) {
    var options = {
        msg: msg,
        method: 'POST',
        url: 'https://slack.com/api/chat.postMessage',
        headers:
        {
          Authorization: 'Bearer ' + URL,
          'Content-Type': 'application/json'
        },
        body: { channel: channel, text: msg, attachments: attachments, thread_ts: ts },
        json: true
      };
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        if(cb) cb(body);
        else return;
      });
}
/**
 * Reads the reactions of one message
 * @param {String} channel Channel of message to find
 * @param {String} ts Timestamp of message to find
 * @returns {Object} Object of reactions
 */
async function getOneReactions(channel, ts) {
  return rp(`https://slack.com/api/reactions.get?token=${URL}&channel=${channel}&timestamp=${ts}&pretty=1`).then((htmlString) => {
    let json = JSON.parse(htmlString);
    if (!json.ok) throw "Bad Request";
    if (json.message.reactions === undefined) console.log("No Reactions");
    else{
      // console.log(json.message.reactions);
      return json.message.reactions;
    }
  }).catch((err) => {
    throw "API Call Failed";
    });
}
exports.getOneReactions = getOneReactions;

/**
 * Compares the users list of reaction with autorized users
 * @param {Object} reaction Reaction object from Slack API Call
 * @param {Array[String]} approvingUsers List of authorized users
 * @returns {Boolean} true if one user who reacted matches list of authorized users
 */
function compareUsers(reaction, approvingUsers) {
 let users = reaction.users;
 return users.filter(value => approvingUsers.includes(value));
}
/**
 * Checks message if authorized user has given a thumbs up emoji
 * @param {String} channel Channel ID where message is located
 * @param {String} ts Timestamp of message to find
 * @param {Array[String]} approvingUsers List of authorized users
 */
exports.checkOneThumbsUp = function checkOneThumbsUp(channel, ts, approvingUsers) {
  return new Promise(function (resolve, reject) {
    getOneReactions(channel,ts).then((reactions) => {
     let isUserValid = false;
      reactions.forEach((reaction) => {
        if (reaction.name === '+1') { // If its a thumbs up
          if(compareUsers(reaction, approvingUsers)) {
            return isUserValid = true;
          }
      }});
      if (!isUserValid) reject(false); //TODO Not Correct user handling
      resolve(true);
    });
  });
}
