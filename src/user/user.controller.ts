import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateUserDto) {
    const user = await this.userService.create(data);
    return {
      message: "Usuário criado com sucesso",
      user,
    };
  }
  @UseGuards(AuthGuard)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.update(id, updateUserDto);
    return {
      message: "Usuário atualizado com sucesso",
      updatedUser,
    };
  }
}
