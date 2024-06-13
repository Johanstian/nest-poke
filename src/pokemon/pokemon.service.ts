import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name) private pokemonModel: Model<Pokemon>
  ) {

  }

  async create(createPokemonDto: CreatePokemonDto) {
    // return 'This action adds a new pokemon';

    try {

      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(id: string) {
    // return `This action returns a #${id} pokemon`;
    let pokemon: Pokemon
    // return `This action returns all pokemon`;

    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ no: id })
    }

    if (isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: id.trim() });
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id, name or no: "${id}" not found`)
    }

    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(id);

    try {

      await pokemon.updateOne(updatePokemonDto)
      return { ...pokemon.toJSON(), ...updatePokemonDto }

    } catch (error) {
      this.handleExceptions(error);
    }



  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id)
    // await pokemon.deleteOne();

    // const result = await this.pokemonModel.deleteOne({ _id: id }); Así se podría pero mejor hacemos desestructuración

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if( deletedCount === 0 ) {
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    }

    // return result;

    return;
  }





  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in DB ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error)
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  }


}
