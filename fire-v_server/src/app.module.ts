import { UploadModule } from './upload/upload.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod, Get } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';

import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from './configs/database.config';
import { CommentModule } from './comment/comment.module';
import { AuthService } from './middleware/auth/auth.service';
import { AuthMiddleware } from './middleware/auth/auth.middleware';
import { MediaModule } from './media/media.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SuggestionModule } from './suggestion/suggestion.module';


@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig().appDatabase),
    UserModule, 
    VideoModule, 
    CommentModule, 
    UploadModule, 
    MediaModule, 
    SuggestionModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join('uploads/videos/cvt'),
    // }),

  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'video/all', method: RequestMethod.GET },
        { path: 'video/play/(.*)', method: RequestMethod.GET },
        { path: 'video/play', method: RequestMethod.GET },
        { path: 'video/all/(.*)', method: RequestMethod.GET },
        { path: 'video/views/(.*)', method: RequestMethod.PUT },
        { path: 'comment/video/(.*)', method: RequestMethod.GET },
        { path: 'user/infor/(.*)', method: RequestMethod.GET },
        { path: 'suggestion/search', method: RequestMethod.GET },
        'uploads/videos/cvt/(.*)',

        // { path: 'video/likes/(.*)', method: RequestMethod.PUT },
      //   // { path: 'video/all/vid', method: RequestMethod.GET },
      //   // { path: 'video/one/', method: RequestMethod.GET },
      //   // { path: 'video/entire/', method: RequestMethod.GET },
      //   // { path: 'video/views/', method: RequestMethod.PUT },
      //   'video/all/(.*)',
      //   'video/one/(.*)',
      //   'video/entire/(.*)',
      //   'video/views/(.*)'
      // 'video/play?path=(.*)'
      //'video/play/(.*)',
      )
      .forRoutes(
        {
          path: '*',
          method: RequestMethod.ALL
        })
  }
}
