import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({namespace: 'list-and-boards'})
export class LtsAppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;
  private logger:  Logger = new Logger('LtsAppGateway'); 
  
  handleDisconnect(client: any) {
    this.logger.log(`Client Disconnected: :${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client Connected: :${client.id}`);
    client.emit('connection', "Connected To Server...");
  }

  afterInit(client: Socket) {
    this.logger.log("Socket Server Started...");
  }   

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
