import { ExceptionFilter, Catch, HttpException, ArgumentsHost } from "@nestjs/common";

@Catch()
export class HttpErrorFilter implements ExceptionFilter {

    catch(exception: HttpException, host: ArgumentsHost){
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const status = exception instanceof HttpException ? exception.getStatus() : 400;
        const errorResponse = {
            code: status,
            date: new Date().toLocaleDateString(),
            path: request.url,
            method: request.method,
            message: exception.message.error || exception.message || null            
        }

        response.status(status).json(errorResponse);
    }

}