import { Directive, ComponentFactoryResolver, ComponentFactory, ComponentRef } from '@angular/core';

import { ViewContainerRef } from '@angular/core';
import { UserChatComponent } from './app.user-chat.component.ts';
import { UserService } from './user.service.ts';

@Directive({ 
  selector: '[chats]'
})
export class UserChatDirective {
    constructor(
        private viewContainer: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}

    createChat(userChatComponent: { new(userService:UserService): UserChatComponent } , receiverName:String , initialMessage:string ): ComponentRef<UserChatComponent> {
        //this.viewContainer.clear();

        let userChatFactory = 
          this.componentFactoryResolver.resolveComponentFactory(userChatComponent);
        let userChatComponentRef = this.viewContainer.createComponent(userChatFactory);
        
        // userChatComponentRef.instance.close.subscribe(() => {
        //     userChatComponent.destroy();
        // });
        userChatComponentRef.instance.setReceiverName(receiverName);
        userChatComponentRef.instance.setInitialMessage(initialMessage);

        return userChatComponentRef;
    }
}