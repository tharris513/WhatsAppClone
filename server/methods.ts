import { Meteor } from 'meteor/meteor';
import { Chats, Messages } from '../imports/collections';
import { MessageType, Profile } from '../imports/models';
import { check, Match } from 'meteor/check';

const nonEmptyString = Match.Where((str) => {

});
 
Meteor.methods({
 updateProfile(profile: Profile): void {
    if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');
 
    check(profile, {
      name: nonEmptyString
    });
 
    Meteor.users.update(this.userId, {
      $set: {profile}
    });
  },
  
  addMessage(type: MessageType, chatId: string, content: string) {
      if (!this.userId) throw new Meteor.Error('unauthorized',
      'User must be logged-in to create a new chat');
 
    check(type, Match.OneOf(String, [ MessageType.TEXT ]));
    check(chatId, nonEmptyString);
    check(content, nonEmptyString);
    
    const chatExists = !!Chats.collection.find(chatId).count();
 
    if (!chatExists) {
      throw new Meteor.Error('chat-not-exists',
        'Chat doesn\'t exist');
    }
 
    return {
      messageId: Messages.collection.insert({
        chatId: chatId,
        senderId: this.userId,
        content: content,
        createdAt: new Date(),
        type: type
      })
    };
  }
});