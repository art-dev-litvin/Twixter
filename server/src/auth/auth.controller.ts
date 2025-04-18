import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateProfileDto } from './dtos/updateProfile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const { email, password, username } = body;

    return this.authService.createUser(email, password, username);
  }

  @Post('/update-profile')
  async updateUser(@Body() body: UpdateProfileDto) {
    const { username, newPassword, profileImageBase64, uid } = body;

    return this.authService.updateProfile(
      uid,
      username,
      newPassword,
      profileImageBase64,
    );
  }

  @Get('/user/:id')
  async getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }
}
