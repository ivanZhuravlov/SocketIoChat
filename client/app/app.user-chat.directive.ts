import { Directive, ComponentFactoryResolver, ComponentFactory, ComponentRef } from '@angular/core';

import { ViewContainerRef } from '@angular/core';
import { UserChatComponent } from './app.user-chat.component.ts';

@Directive({ 
  selector: '[chats]'
})
export class UserChatDirective {
    constructor(
        private viewContainer: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}

    createChat(userChatComponent: { new(): UserChatComponent } , id:String ): ComponentRef<UserChatComponent> {
        this.viewContainer.clear();

        let userChatFactory = 
          this.componentFactoryResolver.resolveComponentFactory(userChatComponent);
        let userChatComponentRef = this.viewContainer.createComponent(userChatFactory);
        
        // userChatComponentRef.instance.close.subscribe(() => {
        //     userChatComponent.destroy();
        // });
        userChatComponentRef.instance.setReceiverId(id);

        return userChatComponentRef;
    }
}