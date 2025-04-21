import { Controller, Post, Body, Param, UseGuards, Get } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async ratePost(@Body() createRatingDto: CreateRatingDto) {
    await this.ratingService.ratePost(createRatingDto);

    const counts = await this.ratingService.getPostRatingCounts(
      createRatingDto.postId,
    );

    return counts;
  }

  @Get('/post/:postId')
  async getRatingCounts(@Param('postId') postId: string) {
    const counts = await this.ratingService.getPostRatingCounts(postId);
    return counts;
  }
}
