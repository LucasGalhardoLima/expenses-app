import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, delay } from 'rxjs/operators';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PrismaRetryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Se for erro de conexão com o banco (P1001), tenta novamente
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P1001'
        ) {
          console.log('Database connection failed, retrying...');
          return next.handle().pipe(
            delay(1000), // Aguarda 1 segundo antes de tentar novamente
            retry(2), // Tenta até 2 vezes mais
          );
        }
        return throwError(() => error);
      }),
    );
  }
}
