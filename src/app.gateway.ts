import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WsResponse, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server, Client } from 'socket.io';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit(){
    this.logger.log('Socket Server initialized...');
  }

  handleConnection(client: Client) {
    this.logger.log(`client connected for: ${client.id}`);
  }
  
  handleDisconnect(client: Client) {
    this.logger.log(`client disconnected for: ${client.id}`);
  }

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, text: string): void {
    this.wss.emit('msgToClient', text);
    // client.emit('msgToClient', text);
    // this.logger.log('asdsada');
    // return {event: 'msgToClient', data: 12};
  }
}
